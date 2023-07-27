import { Vertex } from "../graphics/Vertex";
import { gl } from "./gl";


/**
 * Represents the WebGL bufffer
 * */
export class GLBuffer {

	private _hasAttributeLocation: boolean = false;
	private _elementSize: number;
	private _stride: number;
	private _buffer: WebGLBuffer;

	private _targetBufferType: number;
	private _dataType: number;
	private _mode: number;
	private _typeSize: number;

	private _data: number[] = [];
	private _attributes: AttributeInfo[] = [];


	/**
	 * Creates a new GL buffer
	 * @param dataType The data type of this buffer. Default is gl.FLOAT
	 * @param targetBufferType The buffer target type, gl.ARRAY_BUFFER OR gl.ELEMENT_ARRAY_BUFFER Default is gl.ARRAY_BUFFER
	 * @param mode The drawing mode of this buffer. (i.e. gl.TRIANGLES or gl.LINES). Default is gl.TRIANGLES
	 * */
	public constructor(dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
		this._elementSize = 0;
		this._dataType = dataType;
		this._targetBufferType = targetBufferType;
		this._mode = mode;


		//Determine byte size
		switch (this._dataType) {

			case gl.FLOAT:
			case gl.INT:
			case gl.UNSIGNED_INT:
				this._typeSize = 4;//32 BIT
				break;

			case gl.SHORT:
			case gl.UNSIGNED_SHORT:
				this._typeSize = 2;//16 BIT
				break;

			case gl.BYTE:
			case gl.UNSIGNED_BYTE:
				this._typeSize = 1;//8 BIT
				break;


			default:
				throw new Error("Unrecognized data type: " + dataType.toString());
		}

		this._buffer = gl.createBuffer();

	}


	/**
	 * Destroys this buffer
	 * */
	public destroy(): void {
		gl.deleteBuffer(this._buffer);
	}


	/**
	 * Adds on attribute with the provided information to this buffer
	 * @param info The information to be added
	 * */
	public addAttributeLocation(info: AttributeInfo): void {
		this._hasAttributeLocation = true;

		info.offset = this._elementSize;
		this._attributes.push(info);
		this._elementSize += info.size;
		this._stride = this._elementSize * this._typeSize;
	}



	/**
	* Uploads this buffer's data to the GPU.
	**/
	public upload(vertices: Vertex[]): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);

		for (let v of vertices) {
			for (let d of v.toArray()) {
				this._data.push(d);
			}
		}

		let bufferData: ArrayBuffer;
		switch (this._dataType) {
			case gl.FLOAT:
				bufferData = new Float32Array(this._data);
				break;

			case gl.INT:
				bufferData = new Int32Array(this._data);
				break;

			case gl.UNSIGNED_INT:
				bufferData = new Uint32Array(this._data);
				break;

			case gl.SHORT:
				bufferData = new Int16Array(this._data);
				break;

			case gl.UNSIGNED_SHORT:
				bufferData = new Uint16Array(this._data);
				break;

			case gl.BYTE:
				bufferData = new Int8Array(this._data);
				break;

			case gl.UNSIGNED_BYTE:
				bufferData = new Uint8Array(this._data);
				break;
		}

		gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);//Pass some data
		this.unbind();
	}





	/**
	* Bind this buffer
	* @param normalized Indicates if the data should be normalized
	* */
	public bind(normalized: boolean = false, log: boolean = false): void {
		gl.bindBuffer(this._targetBufferType, this._buffer);

		if (this._hasAttributeLocation) {
			for (let a of this._attributes) {
				if (log) {
					console.log("this._elementSize: " + this._elementSize);
					console.log("this._typeSize: " + this._typeSize);
					console.log(a, "this._stride: " + this._stride, "offset: " + a.offset * this._typeSize);
				}

				//stride is length of all attributes byte size
				//offset of attribute is in byte size
				gl.vertexAttribPointer(a.location, a.size, this._dataType, normalized, this._stride, a.offset * this._typeSize);
				gl.enableVertexAttribArray(a.location);
			}
		}
	}


	/**
	 * Unbineds this buffer
	 * */
	public unbind(): void {
		for (let a of this._attributes) {
			gl.disableVertexAttribArray(a.location);
		}
		gl.bindBuffer(this._targetBufferType, undefined);
	}


	/**
	 * Draws this buffer.
	 * */
	public draw(log: boolean = false): void {
		if (this._targetBufferType === gl.ARRAY_BUFFER) {
			//(this._data.length / this._elementSize) would be number of vertices
			gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
		} else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
			gl.drawElements(this._mode, this._data.length, this._dataType, 0);
		}
	}




	/**
	 * Clear out all data in this buffer
	 * */
	public clearData(): void {
		this._data.length = 0;
	}




}



/**
 * Represents the information needed for a GLFbuffer
 * */
export class AttributeInfo {
	/**
	 * The location of this attribute
	 * */
	public location: number;

	/**
	 * The size (number of elements) in this attribute (i.e Vector3 = 3)
	 * */
	public size: number;

	/**
	 * The number of elements from the beginning of the buffer
	 * */
	public offset: number = 0;


}