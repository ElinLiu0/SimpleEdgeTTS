import { 
  Layout,
  ConfigProvider,
  theme,
  Flex, 
  type MenuProps,
  Dropdown,
  Button,
  Space,
  Input,
  Spin
} from "antd";
import React from "react";
import { AudioOutlined,LoadingOutlined } from '@ant-design/icons';
import { EdgeSpeechTTS } from "@lobehub/tts";
import  audioBufferToWav  from "audiobuffer-to-wav"
// import { Buffer } from "buffer";

const flexStyle:React.CSSProperties = {
  marginTop: '50px'
}

const { Search } = Input;

const items:MenuProps['items'] = [
  {
    label: 'zh-CN-XiaoxiaoNeural',
    key: 'zh-CN-XiaoxiaoNeural',
  },
  {
    label: 'zh-CN-XiaoyiNeural',
    key: 'zh-CN-XiaoyiNeural',
  },
  {
    label: 'zh-CN-YunjianNeural',
    key: 'zh-CN-YunjianNeural',
  },
  {
    label: 'zh-CN-YunxiNeural',
    key: 'zh-CN-YunxiNeural',
  },
  {
    label: 'zh-CN-YunxiaNeural',
    key: 'zh-CN-YunxiaNeural',
  },
  {
    label: 'zh-CN-YunyangNeural',
    key: 'zh-CN-YunyangNeural'
  },
  {
    label: 'zh-CN-liaoning-XiaobeiNeural',
    key: 'zh-CN-liaoning-XiaobeiNeural'
  },
  {
    label: 'zh-CN-shaanxi-XiaoniNeural',
    key: 'zh-CN-shaanxi-XiaoniNeural'
  }
]

class App extends React.Component {
  state = {
    isDark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    speaker: 'zh-CN-XiaoxiaoNeural',
    tts: new EdgeSpeechTTS({
      locale: 'zh-CN',
    }),
    synthizing: false
  }
  setSeapeaker = (speaker:string) => {
    this.setState({
      speaker
    })
  }

  speahText = async (text:string) => {
    this.setState({
      synthizing: true
    })
    console.log('speahText', text)
    const { tts } = this.state
    const payload = {
      input: text,
      options: {
        voice: this.state.speaker,
      }
    };
    const response = await tts.createAudio(payload);
    console.log('response', response)
    this.setState({
      synthizing: false
    })
    // Auto Play audio buffer
    const audio = new Audio();
    audio.src = URL.createObjectURL(new Blob([
      audioBufferToWav(response)
    ], { type: 'audio/wav' }));
    audio.play();
  }
  render () {
    return (
      <ConfigProvider
          theme={{
            algorithm: this.state.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
          }}
      >
        <Layout style={{ minHeight: '100vh',overflow: 'hidden' }}>
          <Flex align="center" justify="center" style={flexStyle} vertical={true}>
            <span style={{ 
              fontSize: '30px', 
              fontWeight: 'bold',
              color: this.state.isDark ? '#ffffff' : '#000000',
              marginBottom: '20px'
            }}>
              EdgeSpeech TTS
            </span>
            <Dropdown menu={{
              items,
              onClick: (e) => {
                this.setSeapeaker(e.key)
                console.log('set default voice to', e.key)
              }
            }}>
              <Button>
                <Space>
                  变更TTS音色
                </Space>
              </Button>
            </Dropdown>
            <Flex align="center" style={{ marginTop: '20px' }}>
              <Search
                placeholder="请输入要朗读的文本"
                allowClear
                enterButton={
                  <Button type="primary" icon={<AudioOutlined />}>

                  </Button>
                }
                size="large"
                style={{
                  width: '400px',
                  marginLeft: '10px',
                }}
                onSearch={async (value) => {
                  console.log('onSearch', value)
                  await this.speahText(value)
                }}
              />
              <Spin indicator={<LoadingOutlined />} style={{ marginLeft: '10px' }} spinning={this.state.synthizing}/>
            </Flex>
          </Flex>
        </Layout>
      </ConfigProvider>
    )
  }
}

export default App;