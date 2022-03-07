const { promises: fs } = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')

async function generate() {
  const feed = new RSS({
    title: 'BLOG',
    site_url: 'https://blog.onurilaslan.com',
    feed_url: 'https://blog.onurilaslan.com/feed.xml'
  })

  const posts = await fs.readdir(path.join(__dirname, '..', 'pages', 'articles'))

  await Promise.all(
    posts.map(async (name) => {
      if (name.startsWith('index.')) return

      const content = await fs.readFile(
        path.join(__dirname, '..', 'pages', 'articles', name)
      )
      const frontmatter = matter(content)

      feed.item({
        title: frontmatter.data.title,
        url: '/articles/' + name.replace(/\.mdx?/, ''),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        author: frontmatter.data.author,
        enclosure: {'media': frontmatter.data.media},
      })
    })
  )

  await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
}

generate()
