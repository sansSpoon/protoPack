import { hello, world } from './project';

function greeting() {
	const helloWorld = `${hello} ${world}`;
	console.log(helloWorld); // eslint-disable-line

	const element = document.createElement('div');
	element.innerHTML = helloWorld;
	element.classList.add('hello');

	return element;
}

document.body.appendChild(greeting());
