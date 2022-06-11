import { connect } from 'dva';
import { Modal } from 'antd';
import { useState } from 'react';
import Contract from '@/utils/contract';
import { message } from 'antd';
import { GAS } from '@/utils/near/config';
interface Props {
  deleteModal: boolean;
  setDeleteModal: any;
  clickItem: any;
  reloadTable: Function;
}

const DeleteModal: React.FC<Props> = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  let { contract } = Contract;
  let deleteValue = props.clickItem;
  let title = '删除';
  let onCancel = () => {
    props.setDeleteModal(false);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    if (deleteValue.isOnly) {
      if (deleteValue.listData.cid && !deleteValue.folderName) {
        await contract.file_delete({ cid: deleteValue.listData.cid });
        props.reloadTable();
        props.setDeleteModal(false);
      }
      else if (deleteValue.listData.cid && deleteValue.folderName) {
        await contract.file_delete_in_folder({
          cid: deleteValue.listData.cid,
          folder: deleteValue.folderName,
        });
        props.reloadTable();
        props.setDeleteModal(false);
      }
    }
    else {
      if (deleteValue.listData && !deleteValue.folderName) {
        try {
          await contract.files_delete({ cids: deleteValue.listData }, GAS);
          props.reloadTable();
        } catch (error) {
          message.error('删除失败');
        }
        props.setDeleteModal(false);
      }
      else if (deleteValue.listData && deleteValue.folderName) {
        try {
          await contract.files_delete_in_folder({
            cids: deleteValue.listData,
            folder: deleteValue.folderName,
          });
          props.reloadTable();
        } catch (error) {
          message.error('删除失败');
        }
        props.setDeleteModal(false);
      }
    }
    setConfirmLoading(false);
  };
  return (
    <Modal
      title={title}
      visible={props.deleteModal}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={handleOk}
      centered={true}
      zIndex={1031}
      cancelText={'取消'}
      okText={'确定'}
    >
      是否确认删除此文件(夹)?
    </Modal>
  );
};

function mapStateToProps(state: any) {
  const { token } = state.globalTop;
  return {
    token,
  };
}

export default connect(mapStateToProps)(DeleteModal);
