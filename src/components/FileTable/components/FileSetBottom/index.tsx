import styles from './index.less';
import { connect } from 'dva';
import Iconfont from '@/components/Iconfont';
import Card from '@/components/Card';

interface Props {
  allChecked: 'all' | 'some' | 'no';
  tableCheckedList: any;
  setList: any;
  checkindex: any;
}

const FileSetBottom: React.FC<Props> = (props) => {
  if (props.allChecked === 'no') return <></>;
  let disabledKeyArr: string[];
  let tableCheckedListFilter = props.tableCheckedList.filter((item: any) => {
    return item;
  });
  if (tableCheckedListFilter.length > 1) {
    disabledKeyArr = ['download', 'rename', 'check', 'copy', 'move'];
  }
  function clickItem(item: any) {
    if (item.callback) {
      item.callback(props.checkindex);
    }
  }
  let lines = props.setList.map((item: any, index: number) => {
    let disabled = disabledKeyArr && disabledKeyArr.includes(item.key);
    return (
      <div
        className={`${styles.box} ${disabled ? styles.disabled : ''}`}
        key={index}
        onClick={() => !disabled && clickItem(item)}
      >
        <div className={styles.innerBox} key={index}>
          <Iconfont type={item.icon} size={16}></Iconfont>
        </div>
      </div>
    );
  });

  return (
    <div
      // className={`${styles.FileSetBottomRender} animate__animated animate__fadeInUp animate__faster`}
      className={`${styles.FileSetBottomRender}`}
    >
      {lines}
    </div>
  );
};

function mapStateToProps(state: any) {
  const { token } = state.globalTop;
  return {
    token,
  };
}

export default connect(mapStateToProps)(FileSetBottom);
