import React from 'react';
import merge from 'lodash/merge';
import {Renderer, RendererProps} from 'amis-core';
import {filter} from 'amis-core';
import cx from 'classnames';
import {Icon} from 'amis-ui';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';

/**
 * 状态展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/status
 */
export interface StatusSchema extends BaseSchema {
  /**
   * 指定为状态展示控件
   */
  type: 'status';

  /**
   * 占位符
   * @default -
   */
  placeholder?: string;

  /**
   * 状态图标映射关系
   * @default {
   *    0: 'svg-fail',
   *    1: 'svg-success',
   *    success: 'svg-success',
   *    pending: 'rolling',
   *    fail: 'svg-fail',
   *    queue: 'svg-warning',
   *    schedule: 'svg-schedule'
   *  }
   */
  map?: {
    [propName: string]: string;
  };

  /**
   * 文字映射关系
   *
   * @default {
   *     success: '成功',
   *     pending: '运行中',
   *     fail: '失败',
   *     queue: '排队中',
   *     schedule: '调度中'
   * }
   */
  labelMap?: {
    [propName: string]: string;
  };
}

export interface StatusProps
  extends RendererProps,
    Omit<StatusSchema, 'className'> {}

export class StatusField extends React.Component<StatusProps, object> {
  static defaultProps: Partial<StatusProps> = {
    placeholder: '-',
    map: {
      0: 'svg-fail',
      1: 'svg-success',
      success: 'svg-success',
      pending: 'rolling',
      fail: 'svg-fail',
      queue: 'svg-warning',
      schedule: 'svg-schedule'
    },
    labelMap: {
      success: '成功',
      pending: '运行中',
      fail: '失败',
      queue: '排队中',
      schedule: '调度中'
    }
  };

  render() {
    const {className, style, placeholder, classnames: cx, data} = this.props;
    const map = merge(StatusField.defaultProps.map, this.props?.map);
    const labelMap = merge(
      StatusField.defaultProps.labelMap,
      this.props?.labelMap
    );

    let value = getPropValue(this.props);
    let viewValue: React.ReactNode = (
      <span className="text-muted" key="status-value">
        {placeholder}
      </span>
    );
    let wrapClassName: string = '';

    if (value != undefined && value !== '' && map) {
      if (typeof value === 'boolean') {
        value = value ? 1 : 0;
      } else if (/^\d+$/.test(value)) {
        value = parseInt(value, 10) || 0;
      }

      wrapClassName = `StatusField--${value}`;
      let itemClassName = filter(map[value], data) || '';
      let svgIcon: string = '';

      itemClassName = itemClassName.replace(
        /\bsvg-([^\s|$]+)\b/g,
        (_: string, icon: string) => {
          svgIcon = icon;
          return 'icon';
        }
      );

      if (svgIcon) {
        viewValue = (
          <Icon
            icon={svgIcon}
            className={cx('Status-icon icon', itemClassName)}
            key="icon"
          />
        );
      } else if (itemClassName) {
        viewValue = (
          <i className={cx('Status-icon', itemClassName)} key="icon" />
        );
      }

      if (labelMap && labelMap[value]) {
        viewValue = [
          viewValue,
          <span className={cx('StatusField-label')} key="label">
            {filter(labelMap[value], data)}
          </span>
        ];
      }
    }

    return (
      <span className={cx('StatusField', wrapClassName, className)} style={style}>
        {viewValue}
      </span>
    );
  }
}

@Renderer({
  type: 'status'
})
export class StatusFieldRenderer extends StatusField {}
