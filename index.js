/**
 * Name: Sai Manogna Pentyala
 * Email: spentyal@andrew.cmu.edu
 * Cloudflare Workers Internship Application: Full-Stack
 * Completed the Requirements and points 1 and 2
 * under Extra Credits Section
 */

/**
 * listens for fetch events and 
 * passes on the request to event handler
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * sets or replaces the values of the
 * attributes that exist in the html
 */
class ElementHandler {
	constructor(attribute, value) {
		this.attribute = attribute
		this.value = value
	}
	element(element) {
		const attribute = element.getAttribute(this.attribute)
		if(attribute) {	
			element.setAttribute(this.attribute, this.value)
		} else {
			element.setInnerContent(this.value)
		}		
	}
}

// url to fetch the variants
const URL = "https://cfw-takehome.developers.workers.dev/api/variants"

/**
 * returns the response received after
 * processing the request
 */
async function handleRequest(request) {
	// fetches the response from the URL
	var urlResponse = await fetch(URL)
	// converts response into a JSON format
	var urlJSONResponse = await urlResponse.json()
	// depicts it as an array of two variants
	var urlArr = urlJSONResponse['variants']
	const VARIANT1 = urlArr[0];
	const VARIANT2 = urlArr[1];

	// fetches the cookies
	const cookieString = request.headers.get('cookie')
		
	// if variant1, then fetches the response as my github account
	if (cookieString && cookieString.includes(VARIANT1)) {
		var variantResponse = await fetch(VARIANT1)
		return new HTMLRewriter()
			.on('a#url', new ElementHandler('a#url','Go to see my work on Github'))
			.on('a#url', new ElementHandler('href','https://github.com/ManognaCMU'))
			.on('title', new ElementHandler('title','My GitHub Account'))
			.on('h1#title', new ElementHandler('h1#title','Manogna\'s GitHub'))
			.on('p#description', new ElementHandler('p#description','My Github site contains projects on RestAPI, Android, MVC, BlockChain etc'))
			.transform(variantResponse)
		// if variant2, then fetches the response as my linkedin account
	} else if (cookieString && cookieString.includes(VARIANT2)) {
		var variantResponse = await fetch(VARIANT2)
		return new HTMLRewriter()
			.on('a#url', new ElementHandler('a#url','Go to see my LinkedIn Page'))
			.on('a#url', new ElementHandler('href','https://www.linkedin.com/in/sai-manogna-pentyala-727352125/'))
			.on('title', new ElementHandler('title','My LinkedIn Account'))
			.on('h1#title', new ElementHandler('h1#title','Manogna\'s LinkedIn'))
			.on('p#description', new ElementHandler('p#description','My LinkedIn Profile gives details about my academic qualifications and work experience'))
			.transform(variantResponse)
		// if user requested for the first time, then decide the variant based on random()
	} else {		
		var variant = Math.random() < 0.5 ? urlArr[0] : urlArr[1]
		var variantResponse = await fetch(variant)
		// if variant1, then fetches the response as my github account
		if(variant == urlArr[0]) {
			var response = new HTMLRewriter()
				.on('a#url', new ElementHandler('a#url','Go to see my work on Github'))
				.on('a#url', new ElementHandler('href','https://github.com/ManognaCMU'))
				.on('title', new ElementHandler('title','My GitHub Account'))
				.on('h1#title', new ElementHandler('h1#title','Manogna\'s GitHub'))
				.on('p#description', new ElementHandler('p#description','My Github site contains projects on RestAPI, Android, MVC, BlockChain etc'))
				.transform(variantResponse)
				
			// set the cookie, so that when the user returns then the same variant is returned
			response.headers.append('Set-Cookie', 'URLVariant=https://cfw-takehome.developers.workers.dev/variants/1; path=/')
			return response		
		} else {
			// if variant2, then fetches the response as my linkedin account
			var response = new HTMLRewriter()
				.on('a#url', new ElementHandler('a#url','Go to see my LinkedIn Page'))
				.on('a#url', new ElementHandler('href','https://www.linkedin.com/in/sai-manogna-pentyala-727352125/'))
				.on('title', new ElementHandler('title','My LinkedIn Account'))
				.on('h1#title', new ElementHandler('h1#title','Manogna\'s LinkedIn'))
				.on('p#description', new ElementHandler('p#description','My LinkedIn Profile gives details about my academic qualifications and work experience'))
				.transform(variantResponse)
			
			// set the cookie, so that when the user returns then the same variant is returned
			response.headers.append('Set-Cookie', 'URLVariant=https://cfw-takehome.developers.workers.dev/variants/2; path=/')
			return response
				
		}
	}		
}
