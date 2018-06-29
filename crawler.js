
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const lowerCase = require('lower-case');
const instagram = {
    UserInfo: async username => {
        try {
            console.log("parse " + username)
            var browser = await puppeteer.launch();
            var page = await browser.newPage();

            await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
            await page.evaluate("navigator.userAgent");
            var request = await page.goto(`https://www.instagram.com/${lowerCase(username)}`, {
                waitUntil: 'networkidle2'
            });

            if (request.status() == 404) {
                browser.close()
                console.log('This account is not exist')
                return 'This account is not exist'
            } else if (request.status() == 429) {

                browser.close()
                console.log('Too many requests')
                return 'Too many requests'

            } else {
                var page_content = await page.content();
                var $ = await cheerio.load(page_content);
                var content = $("body script").html();
                browser.close();
                getData = /window._sharedData = (.*);/g;
                data = JSON.parse(getData.exec(content)[1]);
                profile = JSON.parse(
                    JSON.stringify(data.entry_data["ProfilePage"][0]["graphql"]["user"])
                );
                post = profile.edge_owner_to_timeline_media["edges"];
                var userInfo = {
                    username: profile["username"],
                    full_name: profile["full_name"],
                    profile_picture: profile["profile_pic_url"],
                    profile_picture_hd: profile["profile_pic_url_hd"],
                    is_private: profile["is_private"],
                    id: profile["id"],
                    bio: profile.biography,
                    media: profile.edge_owner_to_timeline_media["count"],
                    followed_by: profile.edge_followed_by["count"],
                    follows: profile.edge_follow["count"],
                    website: profile.external_url,
                };
                return userInfo;
            }

        } catch (error) {
            console.log("Crawler error :" + error)
            /* retry */
            setTimeout(() => {
                instagram.UserInfo(username)
            }, 5000);
        }
    },
}

module.exports = instagram;