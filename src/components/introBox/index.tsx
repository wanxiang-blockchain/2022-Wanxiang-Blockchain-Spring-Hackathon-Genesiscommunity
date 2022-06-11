import './index.less';
import { connect } from 'dva';
import { useRef, useEffect } from 'react'
import arrowRight from '@/assets/images/2.png'
interface Props { }

const Page: React.FC<Props> = (props) => {
    return <div className="intro">
        <div className="wrapper">
            <h1 className="cs">创世云存储</h1>
            <span>Decentralized Storage</span>
            <p style={{marginTop:'47px'}} className='intr0-text-p'>分布式存储技术</p>
            <p className='intr0-text-p'>非对称技术加密</p>
            <p className='intr0-text-p'>去中心化私钥 </p>
            <p style={{marginBottom:'0px'}} className='intr0-text-p'>开启分布式存储元世界！</p>
            <div className="clear"></div>
            <img src={arrowRight}/>
        </div>
    </div>
};

function mapStateToProps(state: any) {
    const { token } = state.globalTop;
    return {
        token,
    };
}

let connectName = connect(mapStateToProps)(Page);
// connectName.wrappers = ['@/auth/login'];

export default connectName;