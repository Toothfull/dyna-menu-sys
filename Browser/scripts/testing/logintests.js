window.onload = function(){
	suite("The testing suite of cum",()=>{
		setup(()=>{
			console.log( "setup")
	
		})

		teardown(()=>{
			console.log("teardown")
		})

		test( "An epic test.",()=>{
			console.log( "test")
			chai.assert.equal(1,0,"blah blah cum")
			chai.assert.equal($("#example" ).text(),"Example","blah blah cum")
		})
	})
}