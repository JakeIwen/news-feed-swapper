Chrome browser extension to replace Facebook newsfeed with Slack API.

Current development priority:
Implement OAuth 2.0 to allow users to get their own API keys

Project based on NewsFeed Eradicator

news-feed-eradicator.west.io

Everything in ./src/components is new code



![Screenshot](https://github.com/JakeIwen/news-feed-swapper/blob/master/assets/NFSwapper_1.png)

====================

Development
-----------
Project folder structure:

    src                             # Common code across all browsers
    browsers                        # Browser specific code
    assets                          # Images
    news-feed-eradicator.west.io    # Companion website

    # Build output:
    build                           # The raw extension contents for each browser
    dist                            # Distributable extension package for browsers
