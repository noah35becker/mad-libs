
// When createdAt and updatedAt are identical for a given post, removes the updatedAt property
// (this is important for how post-info.handlebars processes post data)
function purgeUpdatedAtProperty(posts){
    const isSinglePost = !Array.isArray(posts);

    if (isSinglePost)
        posts = [posts];

    for (const post of posts){
        if (post.createdAt.toString() === post.updatedAt.toString()){
            delete post.updatedAt;
        }
    }

    if (isSinglePost)
        return posts[0];
    return posts;
}


const sessionTimeout = 1000 * 60 * 5; // User's session expires after 5 minutes


module.exports = {
    purgeUpdatedAtProperty,
    sessionTimeout
};