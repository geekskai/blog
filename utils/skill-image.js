// import adobeXd from '/static/svg/skills/adobe-xd.svg'
// import adobeaudition from '/static/svg/skills/adobeaudition.svg'
// import afterEffects from '/static/svg/skills/after-effects.svg'
// import angular from '/static/svg/skills/angular.svg'
// import aws from '/static/svg/skills/aws.svg'
// import azure from '/static/svg/skills/azure.svg'
// import blender from '/static/svg/skills/blender.svg'
// import bootstrap from '/static/svg/skills/bootstrap.svg'
// import bulma from '/static/svg/skills/bulma.svg'
// import c from '/static/svg/skills/c.svg'
// import canva from '/static/svg/skills/canva.svg'
// import capacitorjs from '/static/svg/skills/capacitorjs.svg'
// import coffeescript from '/static/svg/skills/coffeescript.svg'
// import cplusplus from '/static/svg/skills/cplusplus.svg'
// import csharp from '/static/svg/skills/csharp.svg'
// import css from '/static/svg/skills/css.svg'
// import dart from '/static/svg/skills/dart.svg'
// import deno from '/static/svg/skills/deno.svg'
// import django from '/static/svg/skills/django.svg'
// import docker from '/static/svg/skills/docker.svg'
// import fastify from '/static/svg/skills/fastify.svg'
// import figma from '/static/svg/skills/figma.svg'
// import firebase from '/static/svg/skills/firebase.svg'
// import flutter from '/static/svg/skills/flutter.svg'
// import gcp from '/static/svg/skills/gcp.svg'
// import gimp from '/static/svg/skills/gimp.svg'
// import git from '/static/svg/skills/git.svg'
// import go from '/static/svg/skills/go.svg'
// import graphql from '/static/svg/skills/graphql.svg'
// import haxe from '/static/svg/skills/haxe.svg'
// import html from '/static/svg/skills/html.svg'
// import illustrator from '/static/svg/skills/illustrator.svg'
// import ionic from '/static/svg/skills/ionic.svg'
// import java from '/static/svg/skills/java.svg'
// import javascript from '/static/svg/skills/javascript.svg'
// import julia from '/static/svg/skills/julia.svg'
// import kotlin from '/static/svg/skills/kotlin.svg'
// import lightroom from '/static/svg/skills/lightroom.svg'
// import markdown from '/static/svg/skills/markdown.svg'
// import materialui from '/static/svg/skills/materialui.svg'
// import matlab from '/static/svg/skills/matlab.svg'
// import memsql from '/static/svg/skills/memsql.svg'
// import microsoftoffice from '/static/svg/skills/microsoftoffice.svg'
// import mongoDB from '/static/svg/skills/mongoDB.svg'
// import mysql from '/static/svg/skills/mysql.svg'
// import nextJS from '/static/svg/skills/nextJS.svg'
// import nginx from '/static/svg/skills/nginx.svg'
// import numpy from '/static/svg/skills/numpy.svg'
// import nuxtJS from '/static/svg/skills/nuxtJS.svg'
// import opencv from '/static/svg/skills/opencv.svg'
// import photoshop from '/static/svg/skills/photoshop.svg'
// import php from '/static/svg/skills/php.svg'
// import picsart from '/static/svg/skills/picsart.svg'
// import postgresql from '/static/svg/skills/postgresql.svg'
// import premierepro from '/static/svg/skills/premierepro.svg'
// import python from '/static/svg/skills/python.svg'
// import pytorch from '/static/svg/skills/pytorch.svg'
// import react from '/static/svg/skills/react.svg'
// import ruby from '/static/svg/skills/ruby.svg'
// import selenium from '/static/svg/skills/selenium.svg'
// import sketch from '/static/svg/skills/sketch.svg'
// import strapi from '/static/svg/skills/strapi.svg'
// import svelte from '/static/svg/skills/svelte.svg'
// import swift from '/static/svg/skills/swift.svg'
// import tailwind from '/static/svg/skills/tailwind.svg'
// import tensorflow from '/static/svg/skills/tensorflow.svg'
// import typescript from '/static/svg/skills/typescript.svg'
// import unity from '/static/svg/skills/unity.svg'
// import vitejs from '/static/svg/skills/vitejs.svg'
// import vue from '/static/svg/skills/vue.svg'
// import vuetifyjs from '/static/svg/skills/vuetifyjs.svg'
// import webix from '/static/svg/skills/webix.svg'
// import wolframalpha from '/static/svg/skills/wolframalpha.svg'
// import wordpress from '/static/svg/skills/wordpress.svg'

// import pandas from '/static/svg/skills/pandas.svg'
// import scikitlearn from '/static/svg/skills/scikit-learn.svg'
// import dotnet from '/static/svg/skills/dotnet.svg'
// import dotnetcore from '/static/svg/skills/dotnetcore.svg'
// import kubernetes from '/static/svg/skills/kubernetes.svg'
// import linux from '/static/svg/skills/linux.svg'
// import sqlalchemy from '/static/svg/skills/sqlalchemy.svg'
// import fastapi from '/static/svg/skills/fastapi.svg'

export const skillsImage = (skill) => {
  const skillID = skill.toLowerCase()
  switch (skillID) {
    case "gcp":
      return "/static/svg/skills/gcp.svg"
    case "html":
      return "/static/svg/skills/html.svg"
    case "photoshop":
      return "/static/svg/skills/photoshop.svg"
    case "docker":
      return "/static/svg/skills/docker.svg"
    case "illustrator":
      return "/static/svg/skills/illustrator.svg"
    case "adobe xd":
      return "/static/svg/skills/adobe-xd.svg"
    case "after effects":
      return "/static/svg/skills/after-effects.svg"
    case "css":
      return "/static/svg/skills/css.svg"
    case "angular":
      return "/static/svg/skills/angular.svg"
    case "javascript":
      return "/static/svg/skills/javascript.svg"
    case "next js":
      return "/static/svg/skills/nextJS.svg"
    case "nuxt js":
      return "/static/svg/skills/nuxtJS.svg"
    case "react":
      return "/static/svg/skills/react.svg"
    case "svelte":
      return "/static/svg/skills/svelte.svg"
    case "typescript":
      return "/static/svg/skills/typescript.svg"
    case "vue":
      return "/static/svg/skills/vue.svg"
    case "bootstrap":
      return "/static/svg/skills/bootstrap.svg"
    case "bulma":
      return "/static/svg/skills/bulma.svg"
    case "capacitorjs":
      return "/static/svg/skills/capacitorjs.svg"
    case "coffeescript":
      return "/static/svg/skills/coffeescript.svg"
    case "memsql":
      return "/static/svg/skills/memsql.svg"
    case "mongodb":
      return "/static/svg/skills/mongoDB.svg"
    case "mysql":
      return "/static/svg/skills/mysql.svg"
    case "postgresql":
      return "/static/svg/skills/postgresql.svg"
    case "tailwind":
      return "/static/svg/skills/tailwind.svg"
    case "vitejs":
      return "/static/svg/skills/vitejs.svg"
    case "vuetifyjs":
      return "/static/svg/skills/vuetifyjs.svg"
    case "c":
      return "/static/svg/skills/c.svg"
    case "c++":
      return "/static/svg/skills/cplusplus.svg"
    case "c#":
      return "/static/svg/skills/csharp.svg"
    case "dart":
      return "/static/svg/skills/dart.svg"
    case "go":
      return "/static/svg/skills/go.svg"
    case "java":
      return "/static/svg/skills/java.svg"
    case "kotlin":
      return "/static/svg/skills/kotlin.svg"
    case "julia":
      return "/static/svg/skills/julia.svg"
    case "matlab":
      return "/static/svg/skills/matlab.svg"
    case "php":
      return "/static/svg/skills/php.svg"
    case "python":
      return "/static/svg/skills/python.svg"
    case "ruby":
      return "/static/svg/skills/ruby.svg"
    case "swift":
      return "/static/svg/skills/swift.svg"
    case "adobe audition":
      return "/static/svg/skills/adobeaudition.svg"
    case "aws":
      return "/static/svg/skills/aws.svg"
    case "deno":
      return "/static/svg/skills/deno.svg"
    case "django":
      return "/static/svg/skills/django.svg"
    case "firebase":
      return "/static/svg/skills/firebase.svg"
    case "gimp":
      return "/static/svg/skills/gimp.svg"
    case "git":
      return "/static/svg/skills/git.svg"
    case "graphql":
      return "/static/svg/skills/graphql.svg"
    case "lightroom":
      return "/static/svg/skills/lightroom.svg"
    case "materialui":
      return "/static/svg/skills/materialui.svg"
    case "nginx":
      return "/static/svg/skills/nginx.svg"
    case "numpy":
      return "/static/svg/skills/numpy.svg"
    case "opencv":
      return "/static/svg/skills/opencv.svg"
    case "premiere pro":
      return "/static/svg/skills/premierepro.svg"
    case "pytorch":
      return "/static/svg/skills/pytorch.svg"
    case "selenium":
      return "/static/svg/skills/selenium.svg"
    case "strapi":
      return "/static/svg/skills/strapi.svg"
    case "tensorflow":
      return "/static/svg/skills/tensorflow.svg"
    case "webix":
      return "/static/svg/skills/webix.svg"
    case "wordpress":
      return "/static/svg/skills/wordpress.svg"
    case "azure":
      return "/static/svg/skills/azure.svg"
    case "blender":
      return "/static/svg/skills/blender.svg"
    case "fastify":
      return "/static/svg/skills/fastify.svg"
    case "figma":
      return "/static/svg/skills/figma.svg"
    case "flutter":
      return "/static/svg/skills/flutter.svg"
    case "haxe":
      return "/static/svg/skills/haxe.svg"
    case "ionic":
      return "/static/svg/skills/ionic.svg"
    case "markdown":
      return "/static/svg/skills/markdown.svg"
    case "microsoft office":
      return "/static/svg/skills/microsoftoffice.svg"
    case "picsart":
      return "/static/svg/skills/picsart.svg"
    case "sketch":
      return "/static/svg/skills/sketch.svg"
    case "unity":
      return "/static/svg/skills/unity.svg"
    case "wolframalpha":
      return "/static/svg/skills/wolframalpha.svg"
    case "canva":
      return "/static/svg/skills/canva.svg"
    case "pandas":
      return "/static/svg/skills/pandas.svg"
    case "sklearn":
      return "/static/svg/skills/scikit-learn.svg"
    case ".net":
      return "/static/svg/skills/dotnet.svg"
    case ".net core":
      return "/static/svg/skills/dotnetcore.svg"
    case "kubernetes":
      return "/static/svg/skills/kubernetes.svg"
    case "linux":
      return "/static/svg/skills/linux.svg"
    case "sqlalchemy":
      return "/static/svg/skills/sqlalchemy.svg"
    // case 'fastapi':
    default:
      return "/static/svg/skills/fastapi.svg"
  }
}
