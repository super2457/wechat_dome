class Req {
    constructor() {

    }
}

Object.assign(Req.prototype,{
    get(path,arg){
        return fetch(`${path}${arg}`).then(response => {
            return response.json()
        })
    },
    post(path,json){
        return fetch(`${path}`,{
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials : 'include',  //允许cookie
            body: JSON.stringify(json)
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        }).then(response => {
            return response.json()
        })
    }
});

export default Req