---
title: The curious case of another theme
writings: docs
layout : article.hbs
showNav: true
date: 27th May
---

While setting up my website, I played with a lot of static site generators( Jekyll, Hyde, etc ), out of which [Assemble](http://assemble.io/) really stood out for the following reasons :

- It's quite flexible. It really is.
- It's based on Grunt so it fits my existing workflow of the various plugins.
- Ability to use the templating language of one's own choice ( Handlebars in this case )
- Flexibility to interchangibly use markdown and handlebars.

Let me walk you down as to the use cases which I felt, to make it more clear.

#### Have pages with custom layout
So a blog might have one layout, while the blog listing may have another. Our projects might follow another layout, and then there are those special pages such as the landing page which are completely different from all the others.

With Assemble, we can define multiple layouts and declare the layout to be used in the metadata.

```
<!-- THIS PAGE USES ARTICLE LAYOUT AND FALLS UNDER THE COLLECTION OF BLOGPOSTS -->
---
title: The curious case of another theme
writings: blog
layout : article.hbs
showNav: true
---
```

So all in all I ended up making the following layouts :

1. **article.hbs** - Layout for how the blogpost page would look like.
2. **case.hbs** - I write most of my projects as case studies, so I ended up writing a different layout for my case studies.
3. **page.hbs** - For all the static pages like landing, about, blog listing etc

#### DATA is also flexible
With the ability to use data from an external file or define in the metadata.

