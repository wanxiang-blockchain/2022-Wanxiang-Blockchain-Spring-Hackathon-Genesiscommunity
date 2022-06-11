import styles from './layout.less';
import LeftMenu from '@/components/LeftMenu/index';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import FileModel from '@/components/FileTable/components/fileModel';
import BackPoint from '@/components/BackPoint';
import UserInfoPop from '@/components/userInfoPop';
import { Modal, message } from 'antd';
import '@/components/FileTable/fileTable.less';
import b3 from '@/assets/images/b3.png';
import b2 from '@/assets/images/b2.png';
import b4 from '@/assets/images/b4.png';
import b1 from '@/assets/images/b1.png';
import b5 from '@/assets/images/b5.png';
import { history } from 'umi';
import Contract from '@/utils/contract';
import { client } from '@/utils/contract';
import Iconfont from '@/components/Iconfont';
import { ACCOUNT_ID_SUFFIX, GAS } from '@/utils/near/config';

interface Props {
  dispatch: any;
  getViewAccount: boolean;
}

const Page: React.FC<Props> = (props) => {
  let { contract, getID } = Contract;
  const [userInfoPopDisabled, setUserInfoPopDisabled] = useState(false);
  useEffect(() => {
    props.dispatch({ type: 'globalTop/getUserinfo' });
  }, []);

  const [leftMenuSamllBoxShow, setLeftMenuSamllBoxShow] = useState(false);
  const [leftMenuSmallBoxActive, setLeftMenuSmallBoxActive] = useState(0);
  const [navigativeLiseMouse, setNavigativeLiseMouse] = useState(0);
  const [navigativeListActive, setNavigativeListActive] = useState(0);
  let leftMenuSmallBoxReset = [
    {
      name: '全部文件',
      icon: b3,
      url: '/menu/file',
      rightIcon: ""
    },
    {
      name: '图片',
      icon: b2,
      url: '/menu/image',
      rightIcon: ""
    },
    {
      name: '音频',
      icon: b4,
      url: '/menu/audio',
      rightIcon: ""
    },
    {
      name: '视频',
      icon: b1,
      url: '/menu/video',
      rightIcon: ""
    },
    {
      name: '文档',
      icon: b5,
      url: '/menu/document',
      rightIcon: ""
    },
    {
      name: '其他',
      icon: b3,
      url: '/menu/other',
      rightIcon: ""
    },
  ];
  const [leftMenuSmallBoxList, setleftMenuSmallBoxList] = useState(leftMenuSmallBoxReset);
  useEffect(() => {
    judgePathname();
  }, []);

  useEffect(() => {
    let unlisten = history.listen((location) => {
      if (location.pathname === '/menu/home') {
        setLeftMenuSamllBoxShow(false);
      } else {
        setLeftMenuSamllBoxShow(true);
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  function judgePathname() {
    leftMenuSmallBoxList.forEach((item, index) => {
      if (item.url === history.location.pathname) {
        setLeftMenuSmallBoxActive(index);
      }
    });
  }

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      judgePathname();
    });
    return () => {
      unlisten();
    };
  }, []);
  function goFileType(item, index) {
    setLeftMenuSmallBoxActive(index);
    history.push(item.url);
  }

  useEffect(() => {
    (async function () {
      try {
        await viewAccount();
      } catch (error) { }
    })();
  }, [props.getViewAccount]);
  const viewAccount = async () => {
    const data = JSON.parse(await contract.view_account({ did: `did:near:${getID}` }));
    let navListView: any = [];
    data.file_folders.forEach((res: string) => {
      if (
        res === 'picture' ||
        res === 'music' ||
        res === 'video' ||
        res === 'document' ||
        res === 'other'
      ) {
      } else {
        navListView.push({
          name: res,
          icon: b3,
          rightIcon: 'icon-shanchu',
          url: `/menu/createFolder/?id=${res}`,
        });
      }
    });
    setleftMenuSmallBoxList([...leftMenuSmallBoxReset, ...navListView]);
  };

  let rightIconStaticRender = () => {
    leftMenuSmallBoxReset.map((item, index) => {
      if (index > 6) {
        if (item.rightIcon) {
          return (
            <div

              className={`${styles.rightIcon} ${navigativeLiseMouse === index
                ? styles.animate + ' animate__animated animate__fadeInRight'
                : ''
                }`}
              onClick={(e) => deleteFolder(e, item.name)}
            >
              <Iconfont type={item.rightIcon} size={18}></Iconfont>
            </div>
          );
        }
      }
    })

  };
  const deleteFolder = async (e: any, folderName: string) => {
    const hide = message.loading('Delete0...', 0);
    e.stopPropagation();
    try {
      const result = await contract.folder_delete({ folder: folderName }, GAS);
      await viewAccount();
      hide();
      message.success('Success');
    } catch (error) {
      console.error(error);
      hide();
      message.error('Error');
    }
  };

  //静态目录 不能删除
  function leftMenuSmallBoxRender() {
    return leftMenuSmallBoxList.map((item, index) => {
      if (index < 6) {
        return (
          <div
            className={`${styles.leftMenuSmallBox} ${leftMenuSmallBoxActive === index ? styles.leftMenuSmallBoxActive : ''
              }`}
            key={index}
            onClick={() => goFileType(item, index)}
          >
            <div className={styles.leftMenuSmallBoxIcon}>
              <img src={item.icon} alt="" />
            </div>
            <div className={styles.leftMenuSmallBoxName}>{item.name}</div>

            {rightIconStaticRender()}
          </div>
        );
      }

    });
  }

  let onLineClick = (item: any, index: number) => {
    setLeftMenuSmallBoxActive(index);
    history.push(item.url);
  };

  let navigationListScrollRender = leftMenuSmallBoxList.map((item, index) => {
    //点击到当前的新建菜单之后显示删除的垃圾桶
    let rightIconRender = () => {
      if (index >= 6) {
        if (item.rightIcon) {
          return (
            <div
              className={`${styles.rightIcon} ${navigativeLiseMouse === index
                ? styles.animate + ' animate__animated animate__fadeInRight'
                : ''
                }`}
              onClick={(e) => deleteFolder(e, item.name)}
            >
              <Iconfont type={item.rightIcon} size={18}></Iconfont>
            </div>
          );
        }
      }
    };
    if (index >= 6) {
      return (
        <div key={index}>
          <div
            className={`${styles.leftMenuSmallBox} ${leftMenuSmallBoxActive === index ? styles.leftMenuSmallBoxActive : ''}`}
            onClick={() => {
              onLineClick(item, index);
            }}
            onMouseOver={() => {
              setNavigativeLiseMouse(index);
            }}
            onMouseLeave={() => {
              setNavigativeLiseMouse(-1);
            }}
          >

           <div className={styles.leftMenuSmallBoxIcon}>
              {/*<Iconfont type={item.icon} size={18}></Iconfont>*/}
              <img src={item.icon} alt="" />
            </div>

            <div style={{flex:'auto'}} className={styles.leftMenuSmallBoxName}>{item.name}</div>
            {rightIconRender()}
          </div>
        </div>
      );
    } else {
      return;
    }
  });

  return (
    <div className={styles.pageLayout}>
      <LeftMenu setUserInfoPopDisabled={setUserInfoPopDisabled} />
      {/*<BackPoint />*/}
      <div className={styles.rightContext}>
        <div className={`${styles.menuSmallBox} ${leftMenuSamllBoxShow ? styles.show : styles.hide}`}>
          {leftMenuSmallBoxRender()}
          {/*新增文件夹可以滑动并且删除*/}
          {<div style={{overflowY:'auto',height:'200px'}} className={styles.navListBox}>{navigationListScrollRender}</div>}
        </div>
        <div className={styles.relativeBox}>{props.children}</div>
      </div>
      <FileModel></FileModel>
      <Modal
        visible={userInfoPopDisabled}
        footer={null}
        wrapClassName={'loginOutDialog'}
        onCancel={() => setUserInfoPopDisabled(false)}
        closable={false}
        width={235}
        style={{ position: 'absolute', left: 200 }}
        bodyStyle={{ padding: 0 }}
        mask={false}
      >
        <UserInfoPop userInfoPopDisabled={userInfoPopDisabled}></UserInfoPop>
      </Modal>

    </div>
  );
};

function mapStateToProps(state: any) {
  const { token, getViewAccount } = state.globalTop;
  return {
    token,
    getViewAccount,
  };
}

let connectName = connect(mapStateToProps)(Page);
// connectName.wrappers = ['@/auth/login'];

export default connectName;
