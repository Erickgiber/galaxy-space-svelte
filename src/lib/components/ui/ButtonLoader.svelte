<span class="loader" />

<style lang="scss">
	.loader {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		display: block;
		margin: 15px auto;
		position: relative;
		color: #fff;
		left: -120px;
		box-sizing: border-box;
		animation: shadowRolling 2s linear infinite;
	}

	@keyframes shadowRolling {
		0% {
			box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
		}
		12% {
			box-shadow: 100px 0 var(--primary), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0);
		}
		25% {
			box-shadow: 110px 0 var(--primary), 100px 0 var(--primary), 0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0);
		}
		36% {
			box-shadow: 120px 0 var(--primary), 110px 0 var(--primary), 100px 0 var(--primary),
				0px 0 rgba(255, 255, 255, 0);
		}
		50% {
			box-shadow: 130px 0 var(--primary), 120px 0 var(--primary), 110px 0 var(--primary),
				100px 0 var(--primary);
		}
		62% {
			box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 var(--primary), 120px 0 var(--primary),
				110px 0 var(--primary);
		}
		75% {
			box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
				130px 0 var(--primary), 120px 0 var(--primary);
		}
		87% {
			box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0), 130px 0 var(--primary);
		}
		100% {
			box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
		}
	}
</style>
