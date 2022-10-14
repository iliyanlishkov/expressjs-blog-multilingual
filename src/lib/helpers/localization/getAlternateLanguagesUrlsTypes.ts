interface AlternateUrls {
	slug: string,
	language: string
}
export type AlternateUrlsArr = AlternateUrls[];


interface customAlternateUrlsParams {
	language: string, 
	parameters: string[] | string,
	queryStrings?: string
};

export type customAlternateUrlsParamsArr = customAlternateUrlsParams[];