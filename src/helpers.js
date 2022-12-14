export const validateData = (...args) => {
	if (args.length === 0) {
		return false;
	}
	for (const val of args) {
		if (!val) {
			return false;
		}
	}
	return true;
};

export const constructUrl = (search, url) => {
	let newsUrl;
	const apiKey = process.env.NEWS_API_KEY;
	if (search) {
		newsUrl = url + `?q=${search}&apiKey=${apiKey}`;
	} else {
		newsUrl = url + `?apiKey=${apiKey}`;
	}
	return newsUrl;
};

export const convertingResponse = (response) => {
	const result = {};
	result.count = response.totalResults;
	result.data = [];
	if (response.totalResults === 0) {
		return result;
	}
	for (const data of response.articles) {
		result.data.push({
			headline: data.title,
			link: data.url
		});
	}
	return result;
};
