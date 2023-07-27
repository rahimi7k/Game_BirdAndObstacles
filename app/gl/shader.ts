import { gl } from "./gl";


export class Shader {

	private _name: string;
	private _program: WebGLProgram;
	private _attributes: { [name: string]: number } = {};
	private _uniforms: { [name: string]: WebGLUniformLocation } = {};

	/**
	 * Creates a new shader
	 * @param name The name of the shader
	 * */
	public constructor(name: string) {
		this._name = name;

	}


	/**
	 * The name of the shader
	 * */
	public get name(): string {
		return this._name;
	}

	/**
	 * Use this shader
	 * */
	public use(): void {
		gl.useProgram(this._program);
	}


	/**
	 * Gets the location of an attribute with the provided name
	 * @param name The name of the attribute whose location to retrieve
	 * */
	public getAttributeLocation(name: string): number {
		if (this._attributes[name] === undefined) {
			throw new Error("Unable to find attribute named: " + name + "in shader named: " + this._name);
		}

		return this._attributes[name];
	}


	/**
	 * Gets the location of an uniform with the provided name
	 * @param name The name of the uniform whose location to retrieve
	 * */
	public getUniformLocation(name: string): WebGLUniformLocation {
		if (this._uniforms[name] === undefined) {
			throw new Error("Unable to find uniform named: " + name + "in shader named: " + this._name);
		}

		return this._uniforms[name];
	}


	/**
	 * Load the shader
	 * @param vertexSource The source of vertex shader
	 * @param fragmentSource The source of fragment shader
	 * 
	 * */
	protected load(vertexSource: string, fragmentSource: string): void {
		const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
		const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);
		this.createProgram(vertexShader, fragmentShader);


		this.detectAttributes();
		this.detectUniforms();
	}



	private loadShader(source: string, shaderType: number): WebGLShader {
		let shader: WebGLShader = gl.createShader(shaderType);
		gl.shaderSource(shader, source);//Get the source
		gl.compileShader(shader);// Compile the source you have got it
		let error = gl.getShaderInfoLog(shader);
		error = error.trim();//Edge some versions return space even with no error!
		if (error !== '') {
			throw new Error("Error Compling shader \"" + this._name + "\": " + error);
		}

		return shader;
	}

	private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
		this._program = gl.createProgram();
		gl.attachShader(this._program, vertexShader);
		gl.attachShader(this._program, fragmentShader);

		gl.linkProgram(this._program);

		let error: string = gl.getProgramInfoLog(this._program);
		error = error.trim();//Edge some versions return space even with no error!
		if (error !== '') {
			throw new Error("Error linking shader \"" + this._name + "\": " + error);
		}
	}


	private detectAttributes(): void {
		let attrbuteCount: number = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
		for (let i: number = 0; i < attrbuteCount; i++) {
			let attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
			if (!attributeInfo) {
				break;
			}

			this._attributes[attributeInfo.name] = gl.getAttribLocation(this._program, attributeInfo.name);
		}

	}

	private detectUniforms(): void {
		let uniformCount: number = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
		for (let i: number = 0; i < uniformCount; i++) {
			let info: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
			if (!info) {
				break;
			}

			this._uniforms[info.name] = gl.getUniformLocation(this._program, info.name);
		}

	}

}