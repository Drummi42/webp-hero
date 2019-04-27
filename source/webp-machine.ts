
import {Webp} from "../libwebp/dist/webp.js"
import {loadBinaryData} from "./load-binary-data.js"
import {detectWebpSupport} from "./detect-webp-support.js"
import {WebpMachineOptions, PolyfillDocumentOptions} from "./interfaces.js"

const relax = () => new Promise(resolve => requestAnimationFrame(resolve))

export class WebpMachineError extends Error {}

/**
 * Webp Machine
 * - decode and polyfill webp images
 * - can only decode images one-at-a-time (otherwise will throw busy error)
 */
export class WebpMachine {
	private readonly webp: Webp
	private readonly webpSupport: Promise<boolean>
	private busy = false
	private cache: {[key: string]: string} = {}

	constructor({
		webp = new Webp(),
		webpSupport = detectWebpSupport()
	}: WebpMachineOptions = {}) {
		this.webp = webp
		this.webpSupport = webpSupport
	}

	/**
	 * Decode raw webp data into a png data url
	 */
	async decode(webpData: Uint8Array): Promise<string> {
		if (this.busy) throw new WebpMachineError("cannot decode when already busy")
		this.busy = true

		try {
			await relax()
			const canvas = document.createElement("canvas")
			this.webp.setCanvas(canvas)
			this.webp.webpToSdl(webpData, webpData.length)
			this.busy = false
			return canvas.toDataURL()
		}
		catch (error) {
			this.busy = false
			error.name = WebpMachineError.name
			error.message = `failed to decode webp image: ${error.message}`
			throw error
		}
	}

	/**
	 * Polyfill the webp format on the given <img> element
	 */
	async polyfillImage(image: Element, attributes:Array<string> = ['src']): Promise<void> {
		if (await this.webpSupport) return

		for(let i = 0; i < attributes.length; i++) {
            const src = image.getAttribute(attributes[i])

            if (/\.webp$/i.test(src)) {
            	if (this.cache[src]) {
            		image.setAttribute(attributes[i],this.cache[src])
					return
            	}
            	try {
            		const webpData = await loadBinaryData(src)
					const pngData = await this.decode(webpData)
					this.cache[src] = pngData
					image.setAttribute(attributes[i], pngData)
            	}
            	catch (error) {
            		error.name = WebpMachineError.name
					error.message = `failed to polyfill image "${src}": ${error.message}`
					throw error
            	}
            }
		}
	}

	/**
	 * Polyfill webp format on the entire web page
	 */
	async polyfillDocument(tags: Array<string> = ['img'], attributes:Array<string> = ['src'], {document = window.document}: PolyfillDocumentOptions = {}): Promise<void> {
		if (await this.webpSupport) return null

        for(let i = 0; i<tags.length; i++) {
            for(const image of Array.from(document.querySelectorAll(tags[i]))){
                try {
                    await this.polyfillImage(image, attributes)
                }
                catch (error) {
                    error.name = WebpMachineError.name
                    error.message = `webp image polyfill failed for image "${image}": ${error}`
                    throw error
                }
            }
        }
	}
}
