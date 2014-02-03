
(function()
{
	Signaling = function( httpPath )
	{
		if( httpPath ) {
			this._socket = io.connect(httpPath);
			this._socket.on( "onEvent", handler(this, this.__onServerMessage) );
		}
	}
	
	Signaling.prototype._socket;
	Signaling.prototype._callback;
	
	/*
	 * PUBLIC API
	 */
	
	Signaling.prototype.send = function( data ) {
		if( this._socket ) this._socket.emit( "dispatchEvent", data );
	}
	
	Signaling.prototype.onMessage = function( callback ) {
		if( typeof(callback) != "function" ) return;
		this._callback = callback;
	}
	
	/*
	 * PRIVATE API
	 */
	
	Signaling.prototype.__onServerMessage = function( event ) {
		if( this._callback ) this._callback(event);
	}
	
	/*
	 * UTILS
	 */
	
	copyArray = function( args )
	{
		if( args == undefined ) return;
		var aArgs = [], nLen = args.length;
		for( var i = 0; i < nLen; i++ ) aArgs.push( args[i] );
		return aArgs;
	}
	
	handler = function( __object, __func ) 
	{
		var args = arguments.length > 2 ? copyArray(arguments).slice(2) : [];
		var f = function() 
		{
			var i, _callee = arguments.callee, calleeArgs = [];
			for( i = 0; i < arguments.length; i++ )
			{
				calleeArgs.push( arguments[i] );
			}
			return _callee.method.apply(_callee.scope, ([]).concat(_callee.args, calleeArgs) );
		}
		f.scope = __object; f.method = __func; f.args = args;
		return f;
	}
})();