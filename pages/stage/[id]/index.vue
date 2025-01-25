<script setup lang="ts">
import { routes } from "~/_src/helpers";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  router.replace(routes.stage.challenges(route.params.id as string));
});
</script>
