# wan-select
angular material multiselect component

### [demo](http://blog.0xfc.cn/2015/08/21/wan-select/) ###
> ![demo](http://7xl1b4.com1.z0.glb.clouddn.com/wan-select.png)

**demo**

> demo/index.html

**dependencies**
> angular 1.3.15, angular material ~0.10.0 as bower.json says.

**install**
> `bower install wan-select --save`

**how to use**

> in you index.html include wan-select.js and wan-select.css
>
> `app.module('your angular app name', 'fc.wanSelect')`

**use like this**

``` html
<wan-select placeholder="@" source-data="=" selected-data="=" select-changed="&"></wan-select>
``` 

**params**
> placeholder: placeholder, string.
>
> source-data: source-data, array.
>  
> selected-data: selected-data, array.
> 
> select-changed: trigger, when selected-data is changed.

