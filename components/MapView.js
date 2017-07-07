import React, {PropTypes, Component} from 'react'
import {
  View,
  UIManager,
  NativeModules,
  Platform,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native'
import {LatLng, Region} from './PropTypes'
import Marker from './Marker'
import Overlay from './Overlay'
import Polyline from './Polyline'
import Polygon from './Polygon'
import Circle from './Circle'

class MapView extends Component {
  static propTypes = {
    ...View.propTypes,

    /**
     * 地图类型
     *
     * - standard: 标准地图
     * - satellite: 卫星地图
     * - navigation: 导航地图
     * - night: 夜间地图
     * - bus: 公交地图
     */
    mapType: PropTypes.oneOf(['standard', 'satellite', 'navigation', 'night', 'bus']),

    /**
     * 是否启用定位
     */
    locationEnabled: PropTypes.bool,

    /**
     * 是否显示室内地图
     */
    showsIndoorMap: PropTypes.bool,

    /**
     * 是否显示室内地图楼层切换控件
     */
    showsIndoorSwitch: PropTypes.bool,

    /**
     * 是否显示3D建筑
     */
    showsBuildings: PropTypes.bool,

    /**
     * 是否显示文本标签
     */
    showsLabels: PropTypes.bool,

    /**
     * 是否显示指南针
     */
    showsCompass: PropTypes.bool,

    /**
     * 是否显示放大缩小按钮
     */
    showsZoomControls: PropTypes.bool,

    /**
     * 是否显示比例尺
     */
    showsScale: PropTypes.bool,

    /**
     * 是否显示定位按钮
     */
    showsLocationButton: PropTypes.bool,

    /**
     * 是否显示路况
     */
    showsTraffic: PropTypes.bool,

    /**
     * 最大缩放级别
     */
    maxZoomLevel: PropTypes.number,

    /**
     * 最小缩放级别
     */
    minZoomLevel: PropTypes.number,

    /**
     * 当前缩放级别，取值范围 [3, 20]
     */
    zoomLevel: PropTypes.number,

    /**
     * 中心坐标
     */
    coordinate: LatLng,

    /**
     * 设置可见地图区域的矩形
     */
    limitRegion: Region,

    /**
     * 旋转角度，取值范围 [0, 360]
     */
    rotation: PropTypes.number,

    /**
     * 倾斜角度，取值范围 [0, 60]
     */
    tilt: PropTypes.number,

    /**
     * 是否启用缩放手势，用于放大缩小
     */
    zoomEnabled: PropTypes.bool,

    /**
     * 是否启用滑动手势，用于平移
     */
    scrollEnabled: PropTypes.bool,

    /**
     * 是否启用旋转手势，用于调整方向
     */
    rotateEnabled: PropTypes.bool,

    /**
     * 是否启用倾斜手势，用于改变视角
     */
    tiltEnabled: PropTypes.bool,

    /**
     * 点击事件
     */
    onPress: React.PropTypes.func,

    /**
     * 长按事件
     */
    onLongPress: React.PropTypes.func,

    /**
     * 定位事件
     */
    onLocation: React.PropTypes.func,

    /**
     * 动画完成事件
     */
    onAnimateFinish: React.PropTypes.func,

    /**
     * 动画取消事件
     */
    onAnimateCancel: React.PropTypes.func,
  }

  /**
   * 动画过渡到某个位置（坐标、缩放级别、倾斜度）
   *
   * @param {{zoomLevel: ?number, coordinate: ?LatLng, titl: ?number, rotation: ?number}} target
   * @param duration
   */
  animateTo(target, duration = 1000) {
    this._sendCommand('animateTo', [target, duration])
  }

  _sendCommand(command, params = null) {
    switch (Platform.OS) {
      case 'android':
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(this),
          UIManager.AMapView.Commands[command],
          params,
        )
        break;
      case 'ios':
        NativeModules.AMapViewManager[command](findNodeHandle(this), ...params)
        break;
    }
  }

  render() {
    return <AMapView {...this.props}/>
  }

  static Marker = Marker
  static Overlay = Overlay
  static Polyline = Polyline
  static Polygon = Polygon
  static Circle = Circle
}

AMapView = requireNativeComponent('AMapView', MapView)

export default MapView
export {MapView, Marker, Overlay, Polyline, Polygon, Circle}
