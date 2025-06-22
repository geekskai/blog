interface Project {
  title: string
  description: string
  hrefRel?: string | undefined
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: "vue3-jd-h5 is an e-commerce H5 page front-end project",
    description: `Based on vue3.x,vite5.x, vant3.0.0, vue-router v4.0.0-0, vuex^4.0.0-0, vue-cli3, mockjs, imitating Jingdong Taobao, mobile H5 e-commerce platform`,
    imgSrc: "/static/images/vue-jd-h5.png",
    hrefRel: "nofollow",
    href: "https://github.com/geekskai/vue3-jd-h5",
  },
]

export default projectsData
