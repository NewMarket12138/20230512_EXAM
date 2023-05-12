import '../styles/global.less';
import styles from './index.less';

import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const MenuArray = [
  { label: 'Option 1', key: '1', icon: <PieChartOutlined /> },
  { label: 'Option 2', key: '2', icon: <DesktopOutlined /> },
  { label: 'Option 3', key: '3', icon: <ContainerOutlined /> },
  {
    label: 'Navigation One',
    key: 'sub1',
    icon: <MailOutlined />,
    children: [
      { label: 'Option 5', key: '5', icon: null },
      { label: 'Option 6', key: '6', icon: null },
      { label: 'Option 7', key: '7', icon: null },
      { label: 'Option 8', key: '8', icon: null },
    ],
  },
  {
    label: 'Navigation Two',
    key: 'sub2',
    icon: <AppstoreOutlined />,
    children: [
      { label: 'Option 9', key: '9', icon: null },
      { label: 'Option 10', key: '10', icon: null },
    ],
  },
];

const App: React.FC = () => {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [select, setSelect] = useState<any>({});
  const [value, setValue] = useState<string>('');
  const [cKeys, setCkeys] = useState([]);

  useEffect(() => {
    MenuByMemo();
  }, []);

  const MenuByMemo = () => {
    const newArr: MenuItem[] = [];
    MenuArray.forEach((menuItem: any) => {
      if (menuItem?.children?.length > 0) {
        const childArr: MenuItem[] = [];
        menuItem.children.forEach((childItem: any) => {
          childArr.push(childItem);
        });
        newArr.push(
          getItem(menuItem.label, menuItem.key, menuItem.icon, childArr),
        );
      } else {
        newArr.push(getItem(menuItem.label, menuItem.key, menuItem.icon));
      }
    });
    setSelect(MenuArray[0]); // 刚进页面 默认
    setMenuList(newArr);
  };

  /** 寻找对应key的数据 */
  const filterFunc = (arr: any = [], keys: any = '', keysChild?: any) => {
    let selected: any = {};
    arr.forEach((menuItem: any) => {
      if (menuItem.key === keys) {
        // 单菜单
        selected = menuItem;
      } else {
        // 多菜单
        const childArr = menuItem?.children || [];
        childArr.forEach((childItem: any) => {
          if (childItem.key === keys) {
            selected = menuItem;
          }
        });
      }
    });
    return selected;
  };

  const handleMenuSelect = (evt: any) => {
    // 单菜单和多菜单的区分
    const len = evt?.keyPath?.length; // > 1 多菜单  =1 单菜单
    const newArr: MenuItem[] = [...menuList];
    let selected = null;
    if (len == 1) {
      const keys: any = evt?.keyPath[0] || []; // ['']
      selected = filterFunc(newArr, keys);
      setCkeys(keys);
    } else {
      const keys: any = evt?.keyPath || []; // ['', '']
      selected = filterFunc(newArr, keys[1], keys[0]);
      setCkeys(keys);
    }
    setValue('');
    setSelect(selected);
  };

  const handleSaveClick = () => {
    if (!value) return;
    if (select.children) {
      const newArr: MenuItem[] = [...MenuArray];
      const selected = filterFunc(select.children, cKeys[0]);
      selected['label'] = value;
      setMenuList(newArr);
    } else {
      const newArr: MenuItem[] = [...MenuArray];
      const keys: any = select?.key;
      const selected = filterFunc(newArr, keys);
      selected['label'] = value;
      setMenuList(newArr);
    }
  };

  return (
    <div className={styles.container}>
      <Menu
        className={styles.container_menu}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        items={menuList}
        onSelect={handleMenuSelect}
      />
      <Input
        onChange={(evt: any) => setValue(evt?.target?.value)}
        placeholder="Basic usage"
        className={styles.input}
        value={value}
      />
      <Button onClick={handleSaveClick} type="primary" className={styles.btn}>
        点击
      </Button>
    </div>
  );
};

export default App;
