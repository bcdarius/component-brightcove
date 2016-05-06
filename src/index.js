import React from 'react';
import lodashUniqid from 'lodash.uniqueid';

const arbitraryDefaultWidth = 595;
const arbitraryDefaultHeight = 335;
export default class Brightcove extends React.Component {
  static get defaultProps() {
    return {
      experienceID: lodashUniqid('BrightCoveExperience_'),
    };
  }
  constructor(args) {
    super(...args);
    this.unmounted = false;
  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.loadBrightcoveScript().then(() => {
        if (this.unmounted) {
          return;
        }
        this.brightcove.createExperiences();
      }).catch((reason) => {
        if (this.props.onError) {
          this.props.onError(reason);
        }
      });
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    if (this.brightcove) {
      this.brightcove.removeExperience(this.props.experienceID);
    }
    this.unmounted = true;
  }
  loadBrightcoveScript() {
    return this.props.getBrightcoveExperience().then((brightcove) => {
      this.brightcove = brightcove;
      return brightcove;
    });
  }
  render() {
    const {
      videoID,
      playerID,
      playerKey,
      labels,
      width = arbitraryDefaultWidth,
      height = arbitraryDefaultHeight,
    } = this.props;
    return (
      <div className="brightcove" style={{ width, height }}>
        <object id={this.props.experienceID} className="BrightcoveExperience brightcove__experience">
          <param name="bgcolor" value="#FFFFFF" />
          <param name="isUI" value="true" />
          <param name="isVid" value="true" />
          <param name="dynamicStreaming" value="true" />
          <param name="autoStart" value="true" />
          <param name="wmode" value="opaque" />
          <param name="includeAPI" value="true" />
          <param name="cssclass" value="" />
          <param name="width" value={width} />
          <param name="height" value={height} />
          <param name="labels" value={labels} />
          <param name="playerID" value={playerID} />
          <param name="playerKey" value={playerKey} />
          <param name="@videoPlayer" value={videoID} />
        </object>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  Brightcove.propTypes = {
    experienceID: React.PropTypes.string,
    videoID: React.PropTypes.string.isRequired,
    playerID: React.PropTypes.string.isRequired,
    playerKey: React.PropTypes.string.isRequired,
    labels: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    getBrightcoveExperience: React.PropTypes.func,
    onError: React.PropTypes.func,
  };
}
