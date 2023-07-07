import { createClient } from "contentful"

const POSTS_PER_PAGE = 3

const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
})

export async function getPostsOnPage(page, category = undefined) {
    const limit = POSTS_PER_PAGE
    const skip = (page - 1) * limit

    const response = await client.getEntries({
        content_type: "blogPost",
        order: "-sys.createdAt",
        limit,
        skip,
    })
    if (!response.items) {
        return []
    }
    const posts = response.items
    
    return posts.map((post) => {
        return {
            id: post.sys.id,
            slug: post.fields.slug,
            title: post.fields.title,
        }
    })
}

export async function getLatestPosts(limit) {
    const response = await client.getEntries({
        content_type: "blogPost",
        order: "-sys.createdAt",
        limit,
    })
    if (!response.items) {
        return []
    }
    const posts = response.items

    return posts.map((post) => {
        return {
            id: post.sys.id,
            slug: post.fields.slug,
            title: post.fields.title,
        }
    })
}

export async function getAllPostsSlugs() {
    const response = await client.getEntries({
        content_type: "blogPost",
    })
    if (!response.items) {
        return []
    }
    const posts = response.items

    return posts.map((post) => {
        return {
            slug: post.fields.slug,
        }
    })
}

export async function getPostBySlug(slug) {
    const response = await client.getEntries({
        content_type: "blogPost",
        limit: 1,
        "fields.slug": slug,
    })
    if (!response.items) {
        console.error(`Could not fetch blog post: ${slug}!`)
        return {}
    }
    const post = response.items[0]

    return {
        id: post.sys.id,
        slug: post.fields.slug,
        title: post.fields.title,
        text: post.fields.text,
    }
}

export async function getNumberOfPages(category = undefined) {
    const response = await client.getEntries({
        content_type: "blogPost",
        select: "sys.id",
    })
    if (!response.items) {
        return 0
    }
    return Math.ceil(response.total / POSTS_PER_PAGE)
}

export async function getPagesNumbersSlugs(category = undefined) {
    const response = await client.getEntries({
        content_type: "blogPost",
        select: "sys.id",
    })
    if (!response.items) {
        return []
    }
    const totalPosts = response.total
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

    const paths = []

    for (let i = 1; i <= totalPages; i++) {
        paths.push({
            page: i.toString()
        })
    }
    return paths
}