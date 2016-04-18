<!-- index.html -->
    <!DOCTYPE html>

    <!-- define angular app -->
    <html ng-app="scotchApp">
    <head>
      <!-- SCROLLS -->
      <!-- load bootstrap and fontawesome via CDN -->
      <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" />
      <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css" />

      <!-- SPELLS -->
      <!-- load angular via CDN -->
      <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js"></script>
          <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-route.js"></script>
      <script src="script.js"></script>
    </head>

    <!-- define angular controller -->
    <body ng-controller="mainController">

    ...

    <!-- MAIN CONTENT AND INJECTED VIEWS -->
    <div id="main">
        {{ message }}

        <!-- angular templating -->
        <!-- this is where content will be injected -->
    </div>
