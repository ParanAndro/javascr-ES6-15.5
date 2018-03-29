var GIPHY_API_URL = 'http://api.giphy.com',
	GIPHY_PUB_KEY = 'lGei8VBj286w4cil91inuIq6jDJ04f74';

App = React.createClass({
	getInitialState() {
		return {
			loading: false,
			searchingText: '',
			gif: {}
		};
	},

	handleSearch: function(searchingText) { // pobierz na wejsciu wpisywany tekst
		this.setState({
			loading: true // zasygnalizuj, ze zaczął się proces ładowania
		});
		var self = this;
		this.getGif(searchingText)
			.then(function(gif) { // Rozpocznik pobieranie gifa
				self.setState({ // Na zakończenie pobierania:
					loading: false, // a. przestań sygnalizować ładowanie
					gif: gif, // b. ustaw nowego gifa z wyniku pobierania
					searchingText: searchingText // c. ustaw nowy stan dla wyszukiwanego tekstu
				});
			})

			.catch(function(error){
				console.log(error);
			});
	},

	getGif: function(searchingText) {  // 1.
		return new Promise (
			function (resolve, reject) {
				var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2.
				var xhr = new XMLHttpRequest();  // 3.
				xhr.open('GET', url);
				xhr.onload = function() {
					if (xhr.status === 200) {
						var data = JSON.parse(xhr.responseText).data; // 4.
						if (data.type === 'gif') {  // 5.
							var gif = {
								url: data.fixed_width_downsampled_url,
								sourceUrl: data.url
							};
							resolve(gif);   // 6.
						} else {
							reject (new Error('Sorry, no gifs :('));
						} 
					} else {
						reject (new Error(this.statustext));
					}
				};
				xhr.send();
			}
		);
	},

	/* 1. Na wejście metody getGif przyjmujemy dwa parametry: wpisywany tekst (searchingText) i funkcję, 
	która ma się wykonać po pobraniu gifa (callback) */
	/* 2. Konstruujemy adres URL dla API Giphy*/
	/* 3. Wywołujemy całą sekwencję tworzenia zapytania XHR do serwera i wysyłamy je.*/
	/* 4. W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie do zmiennej 
	data, aby nie pisać za każdym razem response.data.*/
	/* 5. Układamy obiekt gif na podstawie tego co otrzymaliśmy z serwera */
	/* 6. Przekazujemy obiekt do funkcji callback, którą przekazaliśmy jako drugi parametr metody getGif.*/


	render: function() {
		var styles = {
			margin: '0 auto',
			textAlign: 'center',
			width: '90%'
		};

		return (
			<div style={styles}>
					<h1>GIFs search engine!</h1>
					<p>Find a GIF on <a href='http://giphy.com'>giphy</a>. Press "Enter" to get more GIFs.</p>
					<Search onSearch={this.handleSearch}/>
				<Gif
					loading={this.state.loading}
					url={this.state.gif.url}
					sourceUrl={this.state.gif.sourceUrl}
				/>
			</div>
		);
	}
});