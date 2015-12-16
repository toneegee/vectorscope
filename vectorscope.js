// _audio: audio context
// _canvas: canvas
// _props.buffersize: buffer size. default is 512
// _props.dotAlpha: vector dot alpha. default is 1.0
// _props.dotThick: vector dot thickness. default is 2.0
// _props.lineAlpha: vector line alpha. default is 0.0
// _props.lineThick: vector line thickness. default is 2.0
// _props.clear: clear alpha. default is 1.0

var Vectorscope = function( _audio, _canvas, _props ) {

  var it = this;

  if ( !_props ) { _props = {}; }
  it.buffersize = _props.buffersize || 512;
  it.node = _audio.createScriptProcessor( it.buffersize, 2, 2 );

  it.node.onaudioprocess = function( _event ) {
    it.process( _event )
  };

  it.canvas = _canvas;
  it.context = _canvas.getContext( '2d' );

  it.xp = 0.0;
  it.yp = 0.0;

  it.dotAlpha = _props.dotAlpha || 1.0;
  it.dotThick = _props.dotThick || 4.0;
  it.lineAlpha = _props.lineAlpha || 0.0;
  it.lineThick = _props.lineThick || 2.0;
  it.clear = _props.clear || 1.0;

};

Vectorscope.prototype.process = function( _event ) {

  var it = this;

  var inL = _event.inputBuffer.getChannelData( 0 );
  var inR = _event.inputBuffer.getChannelData( 1 );
  var outL = _event.outputBuffer.getChannelData( 0 );
  var outR = _event.outputBuffer.getChannelData( 1 );

  var width = it.canvas.width;
  var height = it.canvas.height;

  it.context.globalAlpha = it.clear;
  it.context.fillStyle = '#000';
  it.context.fillRect( 0, 0, width, height );

  for ( var iBuffer = 0; iBuffer < it.buffersize; iBuffer ++ ) {
    outL[ iBuffer ] = inL[ iBuffer ];
    outR[ iBuffer ] = inR[ iBuffer ];

    var x = ( inL[ iBuffer ] + 1.0 ) * 0.5 * width;
    var y = ( 1.0 - inR[ iBuffer ] ) * 0.5 * height;

    it.context.globalAlpha = it.dotAlpha;
    it.context.fillStyle = '#fff';
    it.context.beginPath();
    it.context.arc( x, y, it.dotThick * 0.5, 0.0, 2.0 * Math.PI, false );
    it.context.fill();

    if ( 0.0 < it.lineAlpha ) {
      it.context.globalAlpha = it.lineAlpha;
      it.context.strokeStyle = '#fff';
      it.context.lineWidth = it.lineThick;
      it.context.beginPath();
      it.context.moveTo( x, y );
      it.context.lineTo( it.xp, it.yp );
      it.context.stroke();
    }

    it.xp = x;
    it.yp = y;
  }

};
