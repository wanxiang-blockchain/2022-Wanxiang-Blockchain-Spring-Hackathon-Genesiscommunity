import styles from './index.less';
import { connect } from 'dva';
import Iconfont from '../Iconfont';
import { useState, useEffect, useRef } from 'react';
import { Modal, message, Space, Input } from 'antd';
import 'animate.css';
import { history } from 'umi';
// import LogoCircle from '@/components/logoCircle'

import Contract from '@/utils/contract';
import { ACCOUNT_ID_SUFFIX, GAS } from '@/utils/near/config';
import { client } from '@/utils/contract'
import icon1 from '@/assets/images/1.png'
import icon2 from '@/assets/images/10.png'
import defaulticon1 from '@/assets/images/11.png'
import defaulticon2 from '@/assets/images/5.png'
import avata from '@/assets/images/4.png'
interface Props {
  dispatch: any;
  userinfo: any;
  setUserInfoPopDisabled: Function
}

const LeftMenu: React.FC<Props> = (props) => {
  const fileRef: any = useRef(null);
  let { contract, getID } = Contract;
  let navigationList = [
    {
      defaulticon:defaulticon1,
      icon: icon1,
      title: '工作台',
      url: '/menu/home',
      rightIcon: '',
    },
    { 
      defaulticon:defaulticon2,
      icon: icon2,
      title: '文件',
      url: '/menu/file',
      rightIcon: '',
    },
    // {
    //   icon: icon,
    //   title: '传输列表',
    //   url: '/menu/history',
    //   rightIcon: '',
    // },
    // {
    //   icon: 'icon-tupian',
    //   title: 'picture',
    //   url: '/menu/image',
    //   rightIcon: '',
    // },
    // {
    //   icon: 'icon-yinpin',
    //   title: 'music',
    //   url: '/menu/audio',
    //   rightIcon: '',
    // },
    // {
    //   icon: 'icon-shipin',
    //   title: 'video',
    //   url: '/menu/video',
    //   rightIcon: '',
    // },
    // {
    //   icon: 'icon-wendang',
    //   title: 'document',
    //   url: '/menu/document',
    //   rightIcon: '',
    // },
    // {
    //   icon: 'icon-qita1',
    //   title: 'other',
    //   url: '/menu/other',
    //   rightIcon: '',
    // },
  ];

  const [navlist, setNavList] = useState(navigationList);
  const [navigativeListActive, setNavigativeListActive] = useState(0);
  useEffect(() => {
    let path = history.location.pathname;
    let index = navlist.findIndex((item) => {
      return item.url === path;
    });
    setNavigativeListActive(index);
  }, []);
  const [state, setstate] = useState({
    folderCreate: false,
    inputFolerText: '',
    confirmLoading: false,
  });
  useEffect(() => {
    (async function () {
      try {
        await viewAccount();
      } catch (error) { }
    })();
    const unlisten = history.listen((location: any) => {
      navigationList.forEach((item, index) => {
        if (item.url === location.pathname) {
          setNavigativeListActive(index);
        }
      });
    });
    return () => {
      unlisten();
    };
  }, []);
  const viewAccount = async () => {
    const data = JSON.parse(await contract.view_account({ did: `did:near:${getID}` }));
    props.dispatch({
      type: 'globalTop/save',
      state: {
        userinfo: {
          image: (data.account.account_images == '' ? avata : ('https://' + data.account.account_images + '.ipfs.dweb.link/' + data.account.account_images_name)),
          name: data.account.account_name
        }
      }
    })

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
          icon: 'icon-wenjian',
          title: res,
          rightIcon: 'icon-shanchu',
          url: `/menu/createFolder/?id=${res}`,
        });
      }
    });
    setNavList([...navigationList, ...navListView]);
  };
  const addFolder = async () => {
    const folderName = state.inputFolerText;
    try {
      navlist.forEach((res: any) => {
        if (res.title === folderName) {
          setstate({
            ...state,
            folderCreate: false,
            inputFolerText: '',
            confirmLoading: false,
          });
          message.error('Existing folder');
          throw Error;
        }
        if (res.title === '') {
          setstate({
            ...state,
            folderCreate: false,
            inputFolerText: '',
            confirmLoading: false,
          });
          message.error('The folder name cannot be empty');
          throw Error;
        }
      });
      setstate({
        ...state,
        confirmLoading: true,
      });
      try {

        await contract.folder_create({ folder: folderName });
        await viewAccount();
      } catch (error) {
        console.log(error);

      }
      setstate({
        ...state,
        folderCreate: false,
        inputFolerText: '',
        confirmLoading: false,
      });
    } catch (error) { }
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
  const [navigativeLiseMouse, setNavigativeLiseMouse] = useState(0);
  let onLineClick = (item: any, index: number) => {
    setNavigativeListActive(index);
    history.push(item.url);
  };
  let navigationListStaticRender = navlist.map((item, index) => {
    let queueRender = () => {
      if (index === 2) {
        return (
          //新建文件夹
          <div className={`${styles.otherTitle} ${styles.title}`}>
            <div>SORT</div>
            <div
              className={styles.iconBorder}
              onClick={() => {
                setstate({ ...state, folderCreate: true });
              }}
            >
              <Iconfont type="icon-xinjianwenjianjia2" size={16}></Iconfont>
            </div>
          </div>
        );
      }
    };
    let rightIconStaticRender = () => {
      if (index < 3) {
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
    };
    if (index < 2) {
      return (
        <div key={index}>
          {/*左侧菜单栏*/}
          <div
            className={`${styles.lineBox} ${navigativeListActive == index ? styles.active : ''}`}
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
            <img className={`${styles.icon} ${navigativeListActive == index ? styles.activity :styles.default}`} src={`${item.defaulticon}`} />
            <div className={styles.lineTitle}>{item.title}</div>
            {/*删除按钮*/}
            {/*{rightIconStaticRender()}*/}
          </div>
          {/*{queueRender()}*/}
        </div>
      );
    } else {
      return;
    }
  });
  /*let navigationListScrollRender = navlist.map((item, index) => {
    let rightIconRender = () => {
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
    };
    if (index >= 3) {
      return (
        <div key={index}>
          <div
            className={`${styles.lineBox} ${navigativeListActive === index ? styles.active : ''}`}
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
            <Iconfont type={item.icon} size={18}></Iconfont>
            <div className={styles.lineTitle}>{item.title}</div>
            {rightIconRender()}
          </div>
        </div>
      );
    } else {
      return;
    }
  });*/

  const [userImage, setUserImage] = useState();
  const [userName, setUserName] = useState(localStorage.getItem('userId') || '');
  function clickUserinfo() {
    history.push('/menu/userinfo');
    setNavigativeListActive(-1);
  }
  async function fileChange(e: any) {
    let files = e.target.files;
    if (!files.length) {
      message.warning('Select File upload');
      return;
    }
    let loading = message.loading('Uploading...', 0);
    try {
      const cid = await client.put(files);
      console.log(cid);
      let res = await contract.save_account_image({
        cid: cid.toString(),
      });
      if (res) {
        props.dispatch({ type: 'globalTop/getUserinfo' })
      }
      message.success('successfully set');
    } catch (error) {
      console.log(error);

      message.success('Setup failed');
    }
    loading();
  }
  useEffect(() => {
    setUserName(props.userinfo.name);
    setUserImage(props.userinfo.image);
  }, [props.userinfo]);
  return (
    <>
    {/* <LogoCircle></LogoCircle> */ }
    < div className= { styles.LeftMenu } >
      {/*<img src={logo} width='120vw' style={{ margin: 'auto' }} alt="" />*/ }

  {/*<div className={styles.title}>NavBar</div>*/ }
  { navigationListStaticRender }
  {/*<div className={styles.navListBox}>{navigationListScrollRender}</div>*/ }
  {/*<div className="fa"></div>*/ }
  <div className={styles.userinfo} onClick={() => {
    props.setUserInfoPopDisabled(true)
    // fileRef.current.click()

  }}>
    <div
      className={styles.avatar}
      style={{
        backgroundImage: `url(${userImage})`,
      }}
    ></div>
    <div className={styles.userName}>{userName.replace('.' + ACCOUNT_ID_SUFFIX, '')}</div>
  </div>
      </div >
  <Modal
    title="新建文件夹"
    visible={state.folderCreate}
    onOk={addFolder}
    confirmLoading={state.confirmLoading}
    onCancel={() => {
      setstate({ ...state, folderCreate: false });
    }}
  >
    <Input
      placeholder="新建文件夹"
      onChange={(e) => setstate({ ...state, inputFolerText: e.target.value.trim() })}
    />
  </Modal>
  <input
    type="file"
    style={{
      display: 'none',
    }}
    onChange={fileChange}
    ref={fileRef}
  />
    </>
  );
};

function mapStateToProps(state: any) {
  const { userinfo } = state.globalTop;
  return {
    userinfo,
  };
}

export default connect(mapStateToProps)(LeftMenu);
