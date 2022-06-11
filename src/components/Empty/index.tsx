import styles from './index.less';
import { connect } from 'dva';

interface Props {
  image?: string;
  title?: string;
}

const Page: React.FC<Props> = (props) => {
  return (
    <div className={styles.noData}>
      <div
        className={styles.image}
        style={{
          backgroundImage: `url(${props.image || require('@/assets/images/noData.png')})`,
        }}
      ></div>
      <div>{props.title || '暂无数据'}</div>
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
