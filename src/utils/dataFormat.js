export function json_to_obj(json) {
  var objs = JSON.parse(json)
  var res = []
  for (var i in objs) {
    var a = {}
    for (var o in objs[i]) {
      a['name'] = o
      a['value'] = objs[i][o]
    }
    res.push(a)
  }
  return res
}

