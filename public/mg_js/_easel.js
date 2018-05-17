import React from 'react';
import THREE from 'three';
import { connect } from '../lib/SelectorUtils';
import classNames from 'classnames';
import CanvasManager from '../pixi/CanvasManager';
import Scene from '../three/Scene';
import { setWindowSize } from '../lib/AppActions';
import { TextureDimensions } from '../constants';

let isSafari =
  (
    /Sandbox/.test(navigator.userAgent) || 
    /Safari/.test(navigator.userAgent)
  ) && 
  /Apple Computer/.test(navigator.vendor);

let Easel = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  },

  getInitialState: function () {
    let frontCanvas = document.createElement('canvas');
    frontCanvas.width = TextureDimensions.WIDTH;
    frontCanvas.height = TextureDimensions.HEIGHT;
    
    let backCanvas = document.createElement('canvas');
    backCanvas.width = TextureDimensions.WIDTH;
    backCanvas.height = TextureDimensions.HEIGHT;

    let frontTexture = new THREE.Texture(frontCanvas);
    frontTexture.needsUpdate = true;
    frontTexture.flipY = !isSafari;

    let backTexture = new THREE.Texture(backCanvas);
    backTexture.needsUpdate = true;
    backTexture.flipY = !isSafari;

    return {
      frontTexture,
      backTexture,
      frontCanvas,
      backCanvas,
      lastTextureLocation: null,
      lastCanvasLocation: null
    };
  },

  componentDidMount: function () {
    this.setState({
      canvasManager: this.createCanvasManager(),
      scene: this.createScene()
    });

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('keydown', this.handleKeyDown);
  },

  createScene: function () {
    return new Scene({
      canvas: this.refs.viewerCanvas,
      textures: [
        this.state.frontTexture,
        this.state.backTexture
      ],
      width: this.props.width,
      height: this.props.height,
      store: this.context.store
    });
  },

  createCanvasManager: function () {
    return new CanvasManager({
      canvases: [
        this.state.frontCanvas,
        this.state.backCanvas
      ],
      textures: [
        this.state.frontTexture,
        this.state.backTexture
      ],
      width: TextureDimensions.WIDTH,
      height: TextureDimensions.HEIGHT,
      store: this.context.store
    });
  },

  handleMouseMove: function (e) {
    let lastLocation = this.state.lastTextureLocation;
    let lastCanvasLocation = this.state.lastCanvasLocation;
    let location = this.textureLocationFromEvent(e);
    let canvasLocation = this.canvasLocationFromEvent(e);

    if (
      lastLocation &&
      lastCanvasLocation &&
      (!location || (location[0] !== lastLocation[0]))
    ) {
      let offset = [
        canvasLocation[0] - lastCanvasLocation[0],
        canvasLocation[1] - lastCanvasLocation[1]
      ];

      location = [
        lastLocation[0],
        lastLocation[1] + offset[0] * 2,
        lastLocation[2] + offset[1] * 2
      ];
    }

    if (location) {
      this.state.canvasManager.handleMouseMove(...location);
      this.setState({
        lastTextureLocation: location,
        lastCanvasLocation: canvasLocation
      });
    }

    this.state.scene.handleMouseMove(...canvasLocation);
  },

  handleMouseDown: function (e) {
    let location = this.textureLocationFromEvent(e);
    if (location) {
      e.preventDefault();
      e.stopPropagation();
      
      this.state.canvasManager.handleMouseDown(...location);
    } else {
      this.state.canvasManager.handleMouseDown();      
    }

    let canvasLocation = this.canvasLocationFromEvent(e);
    this.state.scene.handleMouseDown(...canvasLocation);
  },

  handleMouseUp: function (e) {
    let location = this.textureLocationFromEvent(e);
    if (location) {
      this.state.canvasManager.handleMouseUp(...location);
    } else {
      this.state.canvasManager.handleMouseUp();
    }
    this.setState({ lastTextureLocation: null });
    this.state.scene.handleMouseUp();
  },

  handleKeyDown: function (e) {
    this.state.canvasManager.handleKeyDown(e);
  },

  handleResize: function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.props.dispatch(setWindowSize(width, height));
  },

  textureLocationFromEvent: function (e) {
    let location = this.canvasLocationFromEvent(e);
    let intersection = this.state.scene.getTextureLocation(...location);
    
    if (!intersection) return;

    let [index, x, y] = intersection;

    return [
      index,
      x * TextureDimensions.WIDTH,
      (1 - y) * TextureDimensions.HEIGHT
    ];
  },

  canvasLocationFromEvent: function (e) {
    let x, y;
    let { top, left } = this.refs.viewerCanvas.getBoundingClientRect();

    if (e.type === 'touchstart' || e.type === 'touchmove') {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    } else {
      x = e.pageX;
      y = e.pageY;
    }

    return [
      x - left,
      y - top
    ];    
  },

  dehydrate: function () {
    return this.state.canvasManager.dehydrate();
  },

  rehydrate: function (data) {
    this.state.canvasManager.rehydrate(data);
  },

  render: function () {
    let classes = classNames('easel', {
      'is-hidden': !this.props.visible
    });

    return <div className={classes}>
      <canvas 
        ref="viewerCanvas"
        width={this.props.width}
        height={this.props.height}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onTouchStart={this.handleMouseDown}
        onTouchMove={this.handleMouseMove}
        onTouchEnd={this.handleMouseUp}
       />
    </div>
  }
});

let selector = state => {
  return {
    ...state.app.window,
    visible: state.app.sceneVisible
  };
};

export default connect(selector)(Easel);