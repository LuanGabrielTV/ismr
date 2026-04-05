import {
    UserOutlined, LeftOutlined
} from '@ant-design/icons';
import config from "./config";
import { useState, useEffect } from 'react';
import { Typography, Select, Flex, Layout, Divider, Spin } from 'antd';
import { Preferences } from './Preferences';
import { Link } from 'react-router-dom';
import Topbar from './components/Topbar';
const { Title, Text } = Typography;
const { Header, Content } = Layout;

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

import { openDB } from 'idb';

const flushManualQueue = async () => {
    try {
        const db = await openDB('workbox-background-sync');
        const queueName = "ismr-sync-queue";

        if (!db.objectStoreNames.contains('requests')) return;

        // 1. Just READ the data and close the transaction immediately
        const allRequests = await db.getAll('requests');
        const successfulIds = [];

        console.log(`Found ${allRequests.length} pending requests.`);

        // 2. Perform the Network loop OUTSIDE of a transaction
        for (const entry of allRequests) {
            if (entry.queueName === queueName) {
                try {
                    const requestData = entry.storableRequest?.requestData || entry.requestData;
                    if (!requestData) continue;

                    const response = await fetch(requestData.url, {
                        method: requestData.method || 'PUT',
                        headers: requestData.headers,
                        body: requestData.body,
                    });

                    if (response.ok) {
                        console.log(`✅ Success for entry ${entry.id}`);
                        // Store the ID to delete it in a fresh transaction later
                        successfulIds.push(entry.id);
                    }
                } catch (innerErr) {
                    console.error("Replay failed for this entry:", innerErr);
                }
            }
        }

        // 3. Open a NEW, fresh transaction just for the DELETIONS
        if (successfulIds.length > 0) {
            const deleteTx = db.transaction('requests', 'readwrite');
            const deleteStore = deleteTx.objectStore('requests');

            for (const id of successfulIds) {
                await deleteStore.delete(id);
            }

            await deleteTx.done;
            console.log(`🧹 Successfully removed ${successfulIds.length} entries from IndexedDB.`);
        }
    } catch (err) {
        console.error("Manual flush failed:", err);
    }
};
function PreferencePage() {

    const [preferences, setPreferences] = useState(new Preferences());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPreferences();

        const handleOnline = async () => {
            console.log("🟢 Back Online: Starting Manual Replay...");

            // Give the browser 1 second to truly stabilize the socket
            setTimeout(async () => {
                await flushManualQueue();
            }, 1000);
        };

        window.addEventListener('online', handleOnline);

        // Check on mount in case they loaded the app while already back online
        if (navigator.onLine) {
            flushManualQueue();
        }

        return () => window.removeEventListener('online', handleOnline);
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

export default PreferencePage;

