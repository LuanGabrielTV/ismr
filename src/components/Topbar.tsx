import {
    UserOutlined, SettingOutlined,
    LeftOutlined
} from '@ant-design/icons';
import { Typography, Flex, Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Title } = Typography;
const { Header } = Layout;
import { useLocation, useNavigate } from 'react-router-dom';

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#000000',
    height: 64,
    backgroundColor: '#fefeff',
    fontFamily: 'Wix Madefor Display',
    padding: 0,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: -0.5
};

function Topbar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Header style={headerStyle}>
            <Flex gap='small' style={{ height: '100%' }} justify='space-between' align='center'>
                {location.pathname === "/" && (<Link to="/preferences" style={{ color: 'black' }}><SettingOutlined /></Link>)}
                <div
                    onClick={() => navigate(-1)}
                    style={{ color: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <LeftOutlined />
                </div>
                <Title level={4} style={{ fontWeight: 100, fontFamily: 'Google Sans', margin: 0 }} >ismr</Title>
                <Link to="/register" style={{ color: '#7879F1' }}><UserOutlined /></Link>
            </Flex>
        </Header>
    )
}

export default Topbar;