webp-hero advanced
=========

All instruction you can seen on original github repository [webp-hero](https://github.com/chase-moskal/webp-hero)

### What's advanced?

**old**  

   - Function `polyfillDocument()` and `polyfillImage(image)` accept only **img** tag with **src** attribute.
   
**new**

   - Add to functions few parameters:
        - `polyfillDocument(tags, attributes)` 
            - Tags - array of string. That all elements what you want to check on webp url. (def. ['img'])
            - Attributes - array of string. All attributes in your tags where maybe url. (def. ['src'])
        - `polyfillImage(image, attributes)`
            - Image - element. Work as before
            - Attributes - array of string. As attributes in `polyfillDocument()`
   - File `webplib/dist/webp.js` dont wanna go to bundle. **FIX** (but it is not exactly)
    

### For what?

You can use this polyfill for lazy-loading (usually used **data-src**) or change webp url in your custom tags.

**But you can use this for default values: img and src.**

### example

1. lazy-loading

	```html
    	<script>
    		var webpMachine = new webphero.WebpMachine();
   		    var tags = ['img'];
  		    var attributes = ['src', 'data-src'];
 		    
    		webpMachine.polyfillDocument(tags, attributes);
    	</script>
    ```

2. links on img (custom tags)

	```html
	    <script>
         	var webpMachine = new webphero.WebpMachine();
        	var tags = ['img', 'a', 'div'];
       		var attributes = ['src', 'data-src', 'href', 'data-custom-attr'];
      		    
         	webpMachine.polyfillDocument(tags, attributes);
         </script>
	```

### build


- **install basic package**
	- Run `npm i webp-hero` and install all dependencies

- **Copy files this repo**
	- `source` — source files
	- `libwebp\dist\webp.js` - fixed file
	- `tsconfig.json` — file for build
- **Run build**
    - `npm run build`
    
Sorry for mistakes in English <3