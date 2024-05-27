module.exports = createDocVerObj = (user,files) => {
    const ObjKeys = Object.keys(files)
    let arr = []
    for(let field of ObjKeys){
        newForm = {}
        newForm['user'] = user._id
        newForm['username'] = user.username
        newForm['document'] = files[field]
        newForm['documentName'] = field
        arr.push(newForm)
    }
    return arr
  }

  // let exUser = {
  //     _id: 'kajsndiansdiaosd',
  //     username: 'agus'
  // }

  // let exFiles = {
  //   fotoSiup: '/uploads/profile/fotoSiup-1586168511276.png',
  //   fotoTdp: '/uploads/profile/fotoTdp-1586168511276.png',
  //   fotoNpwp: '/uploads/profile/fotoNpwp-1586168511277.png'
  // }

  // console.log(createDocVerObj(exUser, exFiles))
