import styles from './index.less';
import { connect } from 'dva';
import Card from '@/components/Card';
import Space from '@/components/Space';
import Iconfont from '@/components/Iconfont';
import { useState, useEffect } from 'react';
import Contract from '@/utils/contract';
import { formatBytes } from '@/utils/filter/index';
let { contract, getID } = Contract;
import LogoCircle from '@/components/logoCircle'
import { history } from 'umi';
import Intro from '@/components/introBox'
import homeBackImg from '@/assets/images/3.png'
import { getUploadFiles } from '@/utils/files/uploadFiles';
import { getRecentlyList } from '@/utils/files/recentlyFiles';
import Empty from '@/components/Empty';
import { Popover } from 'antd';
import Decentralized from '@/assets/images/DecentralizedStorag.png'

interface Props { }

const Page: React.FC<Props> = (props) => {
  const [windowHeight, setWindowHeight] = useState(969)
  useEffect(() => {
    setWindowHeight(window.innerHeight)
    console.log(window.innerHeight);
  }, [window.innerHeight])
  const [cardList, setCardList] = useState([
    {
      icon: 'icon-cunchushijian',
      title: 'Storage days',
      number: '0',
      unit: 'day',
    },
    {
      icon: 'icon-cunchudaxiao',
      title: 'Total storage size',
      number: '0',
      unit: 'B',
    },
    {
      icon: 'icon-cunchushuliang',
      title: 'Number of stored file',
      number: '0',
      unit: '',
    },
  ]);
  const [documentList, setDocumentList] = useState([])
  // (<><div><p style={{fontSize:'14px',color:'#252B3A'}}>This is hover content.</p></div></>)
  const content = (text) => {
    return (
      <div><p style={{ fontSize: '14px', color: '#252B3A' }}>{text}</p></div>
    )
  };

  const percentageRender = (documentList) => {
    console.log(documentList)
    return (documentList.map(it => {
      // if (it.count > 0) {
        return (
          <Popover content={content(it.text)} title="">
            <div style={{ width: (it.percentage * 100) + '100%' }}></div>
          </Popover>
        )
      // }
    }))
  }


  let CardListRender = () => {
    return cardList.map((item, index) => {
      if (index <= 1) {
        return (
          <div className={styles.cards}>
            <div className={styles.cardContent}>
              <span className={styles.title}>{item.title}</span>
              <div>{item.number}<span>{item.unit}</span></div>
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.cards}>
            <div className={styles.cardContent}>
              <span className={styles.title}>{item.title}</span>
              <div>{item.number}<span>{item.unit}</span></div>
              <div className={styles.percentageLine}>
                {
                  percentageRender(documentList)
                }
              </div>
            </div>
          </div>
        );
      }

    });
  };
  const getList = async () => {
    let result = await contract.view_account({ did: `did:near:${getID}` });

    result = JSON.parse(result);
    let nowTime = new Date().getTime();
    //Gets the time difference between the creation time and the current time
    nowTime = nowTime - result.document.created.toString().substring(0, 13);
    let time = Math.ceil(nowTime / 1000 / 24 / 3600);
    setCardList([
      {
        icon: 'icon-cunchudaxiao',
        title: '存储大小',
        number: formatBytes(result.files_all_size, 2),
        unit: '',
      },
      {
        icon: 'icon-cunchushijian',
        title: '存储时间',
        number: time,
        unit: '天',
      },
      {
        icon: 'icon-cunchushuliang',
        title: '文件数量',
        number: result.files_num,
        unit: '个',
      },
    ]);
  };

  const getDocumentType = async () => {

    // let result = await contract.view_file_stat({ did: `did:near:${getID}` });

    // result = JSON.parse(result);

    // let totalCount = result.all_size;
    // if (totalCount === 0) { return; }
    setDocumentList([
      {
        text: '视频',
        percentage: parseFloat((2 / 10).toString()).toFixed(2),
        count: 2
      },
      {
        text: '音频',
        percentage: parseFloat((2 / 10).toString()).toFixed(2),
        count: 2
      },
      {
        text: '文件',
        percentage: parseFloat((3 / 10).toString()).toFixed(2),
        count: 3
      },
      {
        text: '图片',
        percentage: parseFloat((2 / 10).toString()).toFixed(2),
        count: 2
      },
      {
        text: '其他',
        percentage: parseFloat((1 / 10).toString()).toFixed(2),
        count: 1
      }
    ])

    
  }

  useEffect(() => {
    (async () => {
      await getList();
      await getDocumentType()
    })();
  }, []);

  function goMore() {
    history.push('/menu/history');
  }

  return (
    <div className={styles.container}>
      {/* <LogoCircle></LogoCircle> */}
      <Intro />
      <img className={styles.backImage} src={homeBackImg} alt="" />

      <div className={styles.home}>
        <div className={styles.leftContext}>
          {/* {nodeRender()} */}
          <Space height={40}></Space>
          <div className={styles.CardList}>{CardListRender()}</div>

        </div>
        <div className={`${styles.rightContext} rightContext`}>
          {/* <AudioMini></AudioMini> */}
          {/* <NetWork></NetWork> */}
        </div>
      </div>
      
      <img className={styles.Decentralized} src={Decentralized} alt=''/>
    </div>
  );
};

function mapStateToProps(state: any) {
  const { token } = state.globalTop;
  return {
    token,
  };
}

let connectName = connect(mapStateToProps)(Page);

export default connectName;
