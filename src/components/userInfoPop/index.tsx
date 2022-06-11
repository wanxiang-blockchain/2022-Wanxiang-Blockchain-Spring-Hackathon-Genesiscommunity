import styles from './index.less';
import { connect } from 'dva';
import { TweenLite, Circ } from 'gsap';
import { useRef, useEffect, useState } from 'react';
import Contract, { client } from '@/utils/contract'
import { message, Spin, Button, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getCidUrl } from '@/utils/common'
import Iconfont from '@/components/Iconfont'
import avata from '@/assets/images/logo.png'
interface Props {
    userInfoPopDisabled: boolean,
    dispatch: any,
    userinfo: any
}

const Page: React.FC<Props> = (props) => {
    let filesInput: any;
    const { contract, signOut, getID } = Contract
    const uoloadAvator = async () => {
        setPicUpload(true)
        const files = filesInput.files
        console.log(files);

        if (files.length === 0) {
            message.warning('Select File To Upload!');
            setPicUpload(false)
            return;
        }
        try {

            const fileTypes = [".jpg", ".png", ".jpeg", "PNG", ".gif"]
            const FileEnd = files[0].name.substring(files[0].name.indexOf("."))
            if (!fileTypes.some((res: string) => {
                return res == FileEnd
            })) {
                message.warning("Please Update Image File")
                return
            }
            const cid = await client.put(files)
            const status = await contract.save_account_image({ cid, name: files[0].name })
            props.dispatch({
                type: 'globalTop/save',
                state: {
                    userinfo: {
                        ...props.userinfo,
                        image: getCidUrl(cid, files[0].name)
                    }
                }
            })
            setAvaterImage(getCidUrl(cid, files[0].name))
            setPicUpload(false)
        } catch (error) {
            message.error('Something Wrong is Coming')
            setPicUpload(false)
        }
    }
    const userInformation = async () => {
        const data = JSON.parse(await contract.view_account({ did: `did:near:${getID}` }))
        console.log('data=====================', data);
        setAccount(data.holder)
        setInfomation(JSON.stringify(data.document))
    }
    const rename = async (e: any) => {
        console.log(e);
        if (e.keyCode == 13) {
            setNameInput(false)
            props.dispatch({
                type: 'globalTop/save',
                state: {
                    userinfo: {
                        ...props.userinfo,
                        name: e.target.value.trim()
                    }
                }
            })
            const status = await contract.save_account_name({ name: e.target.value.trim() })
        }
    }
    const [picDisabled, setPicDisabled] = useState(true)
    const [nameInput, setNameInput] = useState(false)
    const [picUpload, setPicUpload] = useState(false)
    const [avaterImage, setAvaterImage] = useState(avata)
    const [Account, setAccount] = useState('')
    const [information, setInfomation] = useState('')
    const [indentityContentIndex, setIndentityContentIndex] = useState(0)
    useEffect(() => {
        (async () => {
            await userInformation()
        })()
        setAvaterImage(props.userinfo.image)
    }, [])

    return <div  className={props.userInfoPopDisabled ? `${styles.userInfoPop}` : `${styles.userInfoPop} ${styles.disabled}`}>
        <div className={styles.screen}>
            {/*左上角关闭按钮*/}
            <nav className={`${styles.mainNav} ${styles.toggled}`} role="navigation" >
                <ul>
                    {/* <Spin></Spin> */}
                    {
                        !picUpload &&
                        <img onClick={() => { filesInput.click() }} style={{ borderRadius: '50%',display:'block',margin:'auto' }} height={48} width={48} src={avaterImage} alt="" />
                    }
                    {
                        picUpload && <Spin  style={{ display:'block',margin:'auto' }}></Spin>
                    }
                    {
                        !nameInput &&
                        <li><a onClick={() => { setNameInput(true) }}><span>{props.userinfo.name}</span></a></li>
                    }
                    {
                        nameInput &&
                        <li><input type="text" onKeyUp={rename} autoFocus placeholder="新的昵称" onBlur={() => { setNameInput(false) }} /></li>
                    }
                    <div className={styles.account}>
                        <span>账户</span>
                        <p>{Account}</p>
                    </div>
                    <li>
                        <div className={styles.loginoutBtn} onClick={() => { signOut() }}>退出登录</div>
                    </li>
                </ul>
            </nav>
        </div>
        <input
            type="file"
            onChange={uoloadAvator}
            style={{ display: 'none' }}
            ref={(el) => {
                filesInput = el;
            }}
        />
    </div>
};

function mapStateToProps(state: any) {
    const { token, userinfo } = state.globalTop;
    return {
        token,
        userinfo
    };
}

let connectName = connect(mapStateToProps)(Page);
// connectName.wrappers = ['@/auth/login'];

export default connectName;
