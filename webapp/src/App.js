import React, { Component } from 'react';
import { Button, Table } from 'antd';
import './App.less';
import Cookies from 'js-cookie'
import Debug from 'debug';
import request from './request';
import moment from 'moment';

const debug = Debug('app');

function App(props) {
  return (
    <div className="App">
      <h2>{props.message}</h2>
      <Button type="primary" onClick={props.signOut}>Sign out</Button>
      <div className='panel'>
        <h2>访问记录</h2>

        <Table
          rowKey={'route'}
          size={'small'}
          pagination={false}
          dataSource={props.accessRecordSummary}
          columns={[
            {
              title: 'hit',
              dataIndex: 'hit',
              key: 'hit',
              width: 220,
              defaultSortOrder: 'descend',
              sorter: (a, b) => a.hit - b.hit,
            },
            {
              title: 'route',
              dataIndex: 'route',
              key: 'route'
            }
          ]} />

        <Table
          style={{ marginTop: 30 }}
          rowKey={'id'}
          size={'small'}
          pagination={false}
          dataSource={props.accessRecords}
          columns={[
            {
              title: 'timestamp',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 280,
              defaultSortOrder: 'descend',
              sorter: (a, b) => a.createdAt - b.createdAt,
              render: value => moment.unix(value).format()
            },
            {
              title: 'ip',
              dataIndex: 'ip',
              key: 'ip',
              width: 150
            },
            {
              title: 'status',
              dataIndex: 'status',
              key: 'status',
              width: 130
            },
            {
              title: 'path',
              dataIndex: 'path',
              key: 'path',
              width: 350
            },
            {
              title: 'originalUrl',
              dataIndex: 'originalUrl',
              key: 'originalUrl',
              ellipsis: {
                showTitle: false,
              },
            },
            {
              title: 'time',
              dataIndex: 'time',
              key: 'time',
              width: 100
            }
          ]} />
      </div>
    </div>
  );
}

let hoc = (WrappedComponent) => {
  return class EnhancedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: true, message: 'unknown', accessRecords: [], accessRecordSummary: [] };
    }

    async componentDidMount() {
      debug('>>> componentDidMount', window.location);
      let token = Cookies.get('token');

      if (!token) {
        let redirect_uri = `${encodeURIComponent(window.location)}`;
        let url = `${window.location.origin}/api/v1/oauth/authorize?response_type=token&redirect_uri=${redirect_uri}`;
        window.location.href = url;
        return;
      }

      request.token = token;

      let message = await request.message();

      let accessRecords = await request.accessRecords();

      let accessRecordSummary = await request.accessRecordSummary();

      this.setState({ loading: false, message, accessRecords, accessRecordSummary });
    }

    signOut = async () => {
      Cookies.remove('token');
      window.location.reload();
    }

    render() {
      if (this.state.loading) {
        return <></>;
      } else {
        return <WrappedComponent
          message={this.state.message}
          accessRecords={this.state.accessRecords}
          accessRecordSummary={this.state.accessRecordSummary}
          signOut={this.signOut} />;
      }
    }
  }
}

export default hoc(App);