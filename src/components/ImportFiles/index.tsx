import styles from './index.less';
import Iconfont from '@/components/Iconfont';
import { Upload, message, Spin, Modal, Space, Input } from 'antd';
import { Channel } from '@/utils/cluster/fileImport';
import Card from '../Card';
import { connect } from 'dva';
import { Cluster } from '@nftstorage/ipfs-cluster';
import { IPFS_URL_ADD, CLUSTER_URL_PINS } from '@/utils/cluster/config';
import Contract, { client } from '@/utils/contract';
import { useState } from 'react';
import { cidToSid } from '@/utils/common';
import { create } from 'ipfs-http-client';
import { checkFileType } from '@/utils/files/sylEncryption';
import all from 'it-all';
import axios from 'axios';
import file from '@/pages/menu/file';
import addIcon from '@/assets/images/c1.png';
import createFolderIcon from '@/assets/images/c2.png';
import icon from '@/assets/images/1.png';

interface Props {
  title: string;
  reloadTable?: Function;
  setFileModelDisplay: Function;
  setFileDownloadStatus: Function;
  floderType?: string;
  getViewAccount: boolean;
}

const ImportFiles: React.FC<Props> = (props: any) => {
  const [loading, setLoading] = useState(false);
  let { contract, getID } = Contract;
  let filesInput: any;

  const change = async (e: any) => {
    const files = filesInput.files;
    const onStoredChunk = (chunkSize: any) => {
      props.dispatch({
        type: 'fileModelInfo/save',
        state: {
          fileModelDisplay: 'open',
          fileDownloadStatus: {
            progress: (chunkSize / files[0].size) * 100,
            fileName: files[0].name,
            filesize: files[0].size,
            type: '等待中...',
          },
        },
      });
    };
    if (files.length === 0) {
      return;
    }
    if (loading) return;
    try {
      // props.setFileModelDisplay(true);
      props.dispatch({
        type: 'fileModelInfo/save',
        state: {
          fileModelDisplay: 'open',
          fileDownloadStatus: {
            progress: 0,
            fileName: files[0].name,
            filesize: files[0].size,
            type: '等待中...',
          },
        },
      });

      const cid = await client.put(files, { onStoredChunk });
      let type = [];
      if (props.floderType === 'newFloder') {
        type = [checkFileType(files[0].name), props.title];
      } else {
        type = [checkFileType(files[0].name)];
      }
      const tableObj = {
        cid: cid,
        file_name: files[0].name,
        file_size: files[0].size,
        file_type: files[0].type,
        file_owner_folder: type,
      };

      props.dispatch({
        type: 'fileModelInfo/save',
        state: {
          fileModelDisplay: 'open',
        },
      });
      await contract.store(tableObj);
      props.dispatch({
        type: 'fileModelInfo/save',
        state: {
          fileDownloadStatus: {
            progress: 100,
            fileName: files[0].name,
            filesize: files[0].size,
            type: '成功',
            initObj: {
              ...tableObj,
              created: new Date().getTime() + '000000',
            },
          },
        },
      });
      props.reloadTable();
    } catch (error: any) {
      console.log(error);

      if (error.Error == 'filesRepetition') {
        message.warning('文件已存在，请勿再次上传!');
      } else {
        message.error('错误');
      }
      props.dispatch({
        type: 'fileModelInfo/save',
        state: {
          fileDownloadStatus: {
            progress: 100,
            fileName: files[0].name,
            filesize: files[0].size,
            initObj: null,
            type: '失败',
          },
        },
      });
    }
  };
  let navigationList = [
    {
      icon: icon,
      title: '工作台',
      url: '/menu/home',
      rightIcon: '',
    },
    {
      icon: icon,
      title: '文件',
      url: '/menu/file',
      rightIcon: '',
    },
    {
      icon: icon,
      title: '传输列表',
      url: '/menu/history',
      rightIcon: '',
    },
  ];
  const [navlist, setNavList] = useState(navigationList);
  const [state, setstate] = useState({
    folderCreate: false,
    inputFolerText: '',
    confirmLoading: false,
  });
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
        props.dispatch({
          type: 'globalTop/save',
          state: {
            getViewAccount: props.getViewAccount + 1,
          },
        });
      } catch (error) {
        console.error(error);
      }
      setstate({
        ...state,
        folderCreate: false,
        inputFolerText: '',
        confirmLoading: false,
      });
    } catch (error) {}
  };

  return (
    // <Card
    //   borderAnimation={true}
    //   className={styles.card}
    //   // background="linear-gradient(178deg, rgb(22, 23, 25) 0%, rgb(32, 38, 42) 100%)"
    //   defaultBorder={false}
    // >
    // {/* <Upload {...uploadProps} maxCount={1} showUploadList={false} onChange={change}> */}
    <div>
      <div
        className={styles.ImportButton}
        onClick={() => {
          filesInput.click();
        }}
      >
        <div className={styles.addIconBox}>
          <img src={addIcon} alt="" />
        </div>
        <Spin spinning={false} size="small">
          <div className={styles.title}>上传文件</div>
        </Spin>
        <input
          type="file"
          onChange={change}
          className={styles.displayNone}
          ref={(el) => {
            filesInput = el;
          }}
        />
      </div>
      <div
        className={styles.createFolder}
        onClick={() => {
          setstate({ ...state, inputFolerText: '', folderCreate: true });
        }}
      >
        <div className={styles.addIconBox}>
          <img src={createFolderIcon} alt="" />
        </div>
        <Spin spinning={false} size="small">
          <div className={styles.title}>新建文件夹</div>
        </Spin>
      </div>
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
          value={state.inputFolerText}
          onChange={(e) => setstate({ ...state, inputFolerText: e.target.value.trim() })}
        />
      </Modal>
    </div>
    // {/* </Upload> */}
    // {/* </Card> */}
  );
};
function mapStateToProps(state: any) {
  const { token, getViewAccount } = state.globalTop;
  return {
    // dispatch,
    token,
    getViewAccount,
  };
}
export default connect(mapStateToProps)(ImportFiles);
