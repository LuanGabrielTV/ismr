import config from "../config";
import { useState, useEffect } from 'react';
import { Typography, Select, Flex, Layout, Divider, Spin } from 'antd';
import Topbar from '../components/Topbar';
import { Preferences } from '../entities/Preferences';
const { Title, Text } = Typography;
const { Content } = Layout;

function Preference() {

    const [preferences, setPreferences] = useState(new Preferences());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPreferences();
    }, []);

    async function getPreferences() {
        try {
            const response = await fetch(`${config.uri}/preferences`, {
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }
            const preferences = await response.json();
            setPreferences(preferences);
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        }
    }

    async function updatePreferences(dataToUpdate: any) {
        try {
            const response = await fetch(`${config.uri}/preferences`, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(dataToUpdate)
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangeInPreferences = (value: string, fieldName: string) => {
        const updated = {
            ...preferences,
            [fieldName]: value
        };

        setPreferences(updated)
        updatePreferences(updated);
    };

    return (
        <Layout>
            <Topbar />
            <Content style={{ padding: '24px 24px', backgroundColor: 'white' }}>
                <Spin spinning={isLoading} size="large" />
                {!isLoading && (<div>
                    <Title level={4} style={{ textAlign: 'left', fontWeight: 'bold', letterSpacing: -0.5 }}>Preferências</Title>
                    <Divider />
                    <Flex gap='medium' justify='space-between' align='center'>
                        <Text>Idioma padrão</Text>
                        <Select
                            value={preferences?.default_language}
                            onChange={(value) => handleChangeInPreferences(value, 'default_language')}
                            style={{ width: 200, backgroundColor: '#EDEDED' }}
                            options={[
                                { value: 'Português - Brasil', label: 'Português - Brasil' },
                                { value: 'English', label: 'English' },
                                { value: 'Español', label: 'Español' },
                            ]}
                        />
                    </Flex>
                    <Divider />
                    <Flex gap='medium' justify='space-between' align='center'>
                        <Text>Verbosidade</Text>
                        <Select
                            value={preferences?.verbosity}
                            onChange={(value) => handleChangeInPreferences(value, 'verbosity')}
                            style={{ width: 200, backgroundColor: '#EDEDED' }}
                            options={[
                                { value: 'Curto', label: 'Curto' },
                                { value: 'Contextual', label: 'Contextual' }
                            ]}
                        />
                    </Flex>
                    <Divider />
                    <Flex gap='medium' justify='space-between' align='center'>
                        <Text>Voz padrão</Text>
                        <Select
                            value={preferences?.default_voice}
                            onChange={(value) => handleChangeInPreferences(value, 'default_voice')}
                            style={{ width: 200, backgroundColor: '#EDEDED' }}
                            options={[
                                { value: 'Maria - Feminina', label: 'Maria - Feminina' },
                                { value: 'João - Masculino', label: 'João - Masculino' }
                            ]}
                        />
                    </Flex>
                    <Divider />
                    <Flex gap='medium' justify='space-between' align='center'>
                        <Text>Pontualidade</Text>
                        <Select
                            value={preferences?.delivery_frequency}
                            onChange={(value) => handleChangeInPreferences(value, 'delivery_frequency')}
                            style={{ width: 200, backgroundColor: '#EDEDED' }}
                            options={[
                                { value: 'Rápida', label: 'Rápida' },
                                { value: 'Pontual', label: 'Pontual' },
                                { value: 'Tranquila', label: 'Tranquila' }
                            ]}
                        />
                    </Flex>
                </div>)}
            </Content>
        </Layout>
    );
}

export default Preference;

