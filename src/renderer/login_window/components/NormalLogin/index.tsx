import React, { useState } from 'react';
import {
  Form, Input, Button, Checkbox,
} from 'antd';
import md5 from 'md5';
import style from './index.scss';
// eslint-disable-next-line import/extensions
import { mainBridge } from '../../../public/ipcRenderer/index';

function NormalLogin() {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);

    const { username, password } = values;
    mainBridge.mqtt.connect.login(
      username,
      md5(password),
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={style['normal-login']}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="账号"
          name="username"
          rules={[{ required: true, message: '请输入账号!' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码!' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, message: '需要8-16个包含大小写字母和数字的字符' },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ span: 16 }}>
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16 }}>
          <Button type="primary" size="large" htmlType="submit" loading={loading} className={style.submit}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>

  );
}

export default NormalLogin;
