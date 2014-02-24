/**
 * @ngdoc service
 * @name stmIndex.$stmSocial
 *
 * @requires stmIndex.$stmAuth
 * 
 * @description
 * Сервис шаринга и социализации
 *
 *  
 */

angular.module('stmIndex').factory('$stmSocial', ['$stmAuth', function($stmAuth){
     /**
       * @ngdoc property
       * @name stmIndex.$stmSocial#share
       * @propertyOf stmIndex.$stmSocial
       * @returns {Object} Данные шаринга
       */   
    var share = {
        url: $('meta[property="og:url"]').attr('content') || $('base').attr('href'),
        image: $('meta[property="og:image"]').attr('content'),
        title: $('meta[property="og:title"]').attr('content'),
        description: $('meta[property="og:description"]').attr('content')
    };

    var $stmSocial = {
        share: share,
        url: url
    }; 
    return $stmSocial;
     /**
       * @ngdoc method
       * @name stmIndex.$stmSocial#url
       * @methodOf stmIndex.$stmSocial
       *
       * @description
       * URL шаринга
       *
       * @returns {String} URL
       */    
    function url(){
        return share.url + ($stmAuth.isAuth ? '?ref=' + $stmAuth.data.refKey : '');
    }
}]);
