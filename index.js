var React = require('react');

var Dropzone = React.createClass({
  getInitialState: function() {
    return {
      isDragActive: false
    }
  },

  propTypes: {
    onDrop: React.PropTypes.func.isRequired,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
    onDragOver: React.PropTypes.func,
    onDragLeave: React.PropTypes.func
  },

  onDragLeave: function(e) {
    var rect = e.target.getBoundingClientRect();
    // Checks that mouse is not an a child element of the dropzone
    if ( rect.left > e.clientX ||
      rect.right < e.clientX ||
      rect.top < e.clientY ||
      rect.bottom > e.clientY ) {
      this.setState({
        isDragActive: false
      });

      if (this.props.onDragLeave) {
        this.props.onDragLeave()
      }
    }
  },

  onDragOver: function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";

      this.setState({
        isDragActive: true
      });

    if( !this.state.isDragActive ) {
      if (this.props.onDragOver) {
        this.props.onDragOver()
      }
    }
  },

  onDrop: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    for (var i = 0; i < files.length; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files);
      this.props.onDrop(files);
    }
  },

  onClick: function () {
    this.refs.fileInput.getDOMNode().click();
  },

  render: function() {

    var className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    };

    var style = this.props.style || {
      width: this.props.size || 100,
      height: this.props.size || 100,
      borderStyle: this.state.isDragActive ? "solid" : "dashed"
    };


    return (
        React.createElement("div", {className: className, style: style, onClick: this.onClick, onDragLeave: this.onDragLeave, onDragOver: this.onDragOver, onDrop: this.onDrop},
            React.createElement("input", {style: {display: 'none'}, type: "file", multiple: true, ref: "fileInput", onChange: this.onDrop}),
            this.props.children
        )
    );
  }

});

module.exports = Dropzone;
