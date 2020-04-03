<p align="center">
  <img width="256" height="256" src="https://raw.githubusercontent.com/TheCodeExorcist/nabopicro/master/logo.webp">
  <h1 align="center">nabopicro</h1>
  <h3 align="center">A native javascript, bootstrap friendly picture cropper!</h3>
  <p align="center"><i>based on the jQuery dependent <a href="https://github.com/dsalvagni/profile-picture">dsalvigni/profile-picture</a></i></p>
</p>
<br/>
<h2>Highlights</h2>
<ul>
  <li>Only requires bootstrap CSS for an out of the box styling</li>
  <li>Fast, lightweight and easy on ressources</li>
  <li>Drag&drop support</li>
  <li>Touch support</li>
  <li>Permissive MIT license</li>
</ul>
<br/>
<h2>What is it like to use it?<h2>
<img src="https://raw.githubusercontent.com/TheCodeExorcist/nabopicro/master/preview.webp">
<br/>
<h2>Ok, but how do i embed it?</h2>
<p>First of all, make sure your page loads bootstrap CSS. Currently, nabopicro has only been tested with Bootstrap 4 but it should work on some older flavors as well.</p>
<p>Just copy-paste this stylesheet <code>&lt;link&gt;</code> to the <code>&lt;head&gt;</code> of your web page to load the bootstrap CSS (if it is not already done)</p>

```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
```
<p>Also, you need to copy-paste this stylesheet <code>&lt;link&gt;</code> after bootstrap CSS to load our custom rules that comes on top of bootstrap for error display and responsiveness.</p>

```html
<link rel="stylesheet" href="fit/this/path/to/your/needs/nabopicro.min.css">
```

<p>As nabopicro does not rely on bootstrap javascript, you can either use the stock bootstrap JS and ready up for bootstrap 5 or use <a href="https://github.com/thednp/bootstrap.native">bootstrap native</a> for an instant jQuery-free experience. No icon font is required as we already embed optimized SVG icons from the <a href="https://github.com/ionic-team/ionicons">ionicons</a> pack but you can replace them with your own.</p>
<br/>
<p>Now, you need to link nabopicro's javascript to your web page. For better performance, we recommend to put the following script tag at the end of the <code>&lt;body&gt;</code>.</p>

```html
<script defer src="fit/this/path/to/your/needs/nabopicro.min.js"></script>
```

<p>You now need to put nabopicro's HTML markup on your webpage. To do so, copy-paste it from the given <b>example.html</b> file. The last thing you need to do is initializing the component through Javascript the way it is documented in the <code>&lt;script&gt;</code> tag included in the so called <b>example.html</b> file.</p>
<h4>Here you go, enjoy!</h4>
<br/>
<h2>What's planned for the future?</h2>
<p>There are still many ways to improve this piece of software, but here is the upcoming features we planned to add:</p><table >
	<tbody>
		<tr>
			<td>Feature name</td>
			<td>Status</td>
			<td>Assignee</td>
			<td>Should be released in</td>
		</tr>
		<tr>
			<td>Two finger and mouse wheel zoom</td>
			<td>TO DO</td>
      <td>Nobody. <i>Join us for a faster development!</i></td>
			<td>v0.2</td>
		</tr>
		<tr>
			<td>Out of the box CDN loading</td>
			<td>TO DO</td>
			<td>Nobody. <i>Join us for a faster development!</i></td>
			<td>v0.2</td>
		</tr>
		<tr>
			<td>Package manager support</td>
			<td>TO DO</td>
			<td>Nobody. <i>Join us for a faster development!</i></td>
			<td>v0.2</td>
		</tr>
		<tr>
			<td>WebP output on supported browsers</td>
			<td>TO DO</td>
			<td>Nobody. <i>Join us for a faster development!</i></td>
			<td>v0.2</td>
		</tr>
	</tbody>
</table>
<br/>
<h2>This is great but i want it to be the greatest!</h2>
<p>Help us then! As talk is cheap, we can show you the code. Any help is welcome, even if you don't know how to code or where to start, from the code itself to the documentation there is still a lot to do on this project.<br/>You have no time for us? You can still support our work by making a tiny donation! For us even a dollar makes the difference.</p>
<p align="center">
<a href="https://ko-fi.com/thecodeexorcist"><img width="150" src="https://cdn.ko-fi.com/cdn/Kofi_Logo_Blue.svg"><br/>Click here and buy me a coffee!</a>
</p>
