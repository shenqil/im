import React, { useState, useEffect } from 'react';
import {
  Form, Input, Button, Checkbox, message,
} from 'antd';
import md5 from 'md5';
import { throttle } from 'throttle-debounce';
import { ILoginInfo } from '@main/server/interface';
import style from './index.scss';
import { mainBridge } from '../../../public/ipcRenderer/index';

const NormalLogin = function () {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<ILoginInfo>();

  const throttleSaveUserLoginInfo = throttle(1000, () => {
    mainBridge.server.userSrv.saveUserLoginInfo(form.getFieldsValue());
  });

  const onFinish = () => {
    setLoading(true);

    const { username, password } = form.getFieldsValue();

    mainBridge.server.connectSrv.login(
      username,
      md5(password),
    )
      .then(() => {
        message.success('登录成功');
      })
      .catch((err) => {
        console.error(err);
        message.warning('登录失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFieldsChange = () => {
    throttleSaveUserLoginInfo();
  };

  useEffect(() => {
    mainBridge.server.userSrv.getUserLoginInfo()
      .then((res) => {
        form.setFieldsValue(res);
        if (res.username && res.password && res.autoLogin) {
          onFinish();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return (
    <div className={style['normal-login']}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        onFinish={onFinish}
        onFieldsChange={onFieldsChange}
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
          className={style.password}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ span: 16 }} className={style.remember}>
          <Checkbox>
            记住我
          </Checkbox>
        </Form.Item>

        <Form.Item name="autoLogin" valuePropName="checked" wrapperCol={{ span: 16 }}>
          <Checkbox>
            自动登录
          </Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16 }}>
          <Button type="primary" size="large" htmlType="submit" loading={loading} className={style.submit}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>

  );
};

export default NormalLogin;
