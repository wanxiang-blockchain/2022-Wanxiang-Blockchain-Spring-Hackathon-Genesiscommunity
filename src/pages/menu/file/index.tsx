import styles from './index.less';
import { connect } from 'dva';
import FileTable from '@/components/FileTable';
import Contract from '@/utils/contract';
import { DID_TITLE } from '@/utils/near/config';
let { contract, getID } = Contract;
import { history } from 'umi';
import { useState, useEffect, useRef } from 'react';
interface Props { }

const Page: React.FC<Props> = (props) => {
  let title = '全部文件';

  let navigationList = [
    {
      icon: 'icon-tupian',
      title: 'picture',
      url: '/menu/image',
      rightIcon: '',
    },
    {
      icon: 'icon-yinpin',
      title: 'music',
      url: '/menu/audio',
      rightIcon: '',
    },
    {
      icon: 'icon-shipin',
      title: 'video',
      url: '/menu/video',
      rightIcon: '',
    },
    {
      icon: 'icon-wendang',
      title: 'document',
      url: '/menu/document',
      rightIcon: '',
    },
    {
      icon: 'icon-qita1',
      title: 'other',
      url: '/menu/other',
      rightIcon: '',
    },
  ];

  const [navigativeListActive, setNavigativeListActive] = useState(0);

  //todulist
  const getList = async (from_index: number) => {
    let limit = 10;
    let result = await contract.view_all_files({
      did: DID_TITLE + getID,
      from_index: (from_index * limit).toString(),
      limit,
    });
    console.log('result',JSON.parse(result))
    return JSON.parse(result);
  };

  let onLineClick = (item: any, index: number) => {
    setNavigativeListActive(index);
    history.push(item.url);
  };

  let navigationListScrollRender = navigationList.map((item, index) => {
    /*let rightIconRender = () => {
      if (index >= 3) {
        if (item.rightIcon) {
          return (
            <div
              className={`${styles.rightIcon} ${navigativeLiseMouse === index
                ? styles.animate + ' animate__animated animate__fadeInRight'
                : ''
                }`}
              onClick={(e) => deleteFolder(e, item.title)}
            >
              <Iconfont type={item.rightIcon} size={18}></Iconfont>
            </div>
          );
        }
      }
    };*/
    {/*onMouseOver={() => {
              setNavigativeLiseMouse(index);
            }}
            onMouseLeave={() => {
              setNavigativeLiseMouse(-1);
            }}*/}
    return (
      <div key={index}>
        <div
          className={`${styles.lineBox} ${navigativeListActive === index ? styles.active : ''}`}
          onClick={() => {
            onLineClick(item, index);
          }}

        >
          {/*<Iconfont type={item.icon} size={18}></Iconfont>*/}
          <div className={styles.lineTitle}>{item.title}</div>
          {/*{rightIconRender()}*/}
        </div>
      </div>
    );
  });

return (
  // <div style={{display:'flex',height:'100%'}}>
    // <div style={{width:'189px'}}>{navigationListScrollRender}</div>
    <FileTable getList={getList} title={title}/>
  // </div>
)
};

function mapStateToProps(state: any) {
  const { token } = state.globalTop;
  return {
    token,
  };
}

export default connect(mapStateToProps)(Page);
