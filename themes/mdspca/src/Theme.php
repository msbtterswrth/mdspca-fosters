<?php

namespace Drupal\muhc;

use Drupal\block_content\Entity\BlockContent;
use Drupal\Core\Template\Attribute;
use Drupal\image\Plugin\Field\FieldType\ImageItem;
use Drupal\ctek_model\ModelPluginManager;
use Drupal\node\Entity\Node;
use Drupal\paragraphs\Entity\Paragraph;

class Theme {

  /**
   * @var \Drupal\muhc\Theme
   */
  protected static $_instance;

  /**
   * @return \Drupal\muhc\Theme
   */
  public static function getInstance() {
    if (!self::$_instance) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  /**
   * @var \Drupal\Core\Entity\EntityInterface|NULL
   */
  protected $node;

  /**
   * @var \Drupal\ctek_model\Plugin\Model\ModelBase|NULL
   */
  protected $model;

  /**
   * @var ModelPluginManager
   */
  protected $pluginManager;

  /**
   * Theme constructor.
   */
  private function __construct() {
    $this->pluginManager = \Drupal::service('plugin.manager.model');
    $request = \Drupal::request();
    $node = $request->attributes->get('node');
    if ($node) {
      if (!is_object($node)) {
        $node = Node::load($node);
      }
      if ($node) {
        $this->node = $node;
        $this->model = $this->pluginManager->wrap($node);
      }
    }
  }

  /**
   * @return \Drupal\Core\Entity\EntityInterface|NULL
   */
  public static function node() {
    return self::getInstance()->node;
  }

  /**
   * @return \Drupal\ctek_model\ModelInterface|NULL
   */
  public static function model() {
    return self::getInstance()->model;
  }

  /**
   * @return \Drupal\Core\Template\Attribute
   */
  public static function getSiteWrapClasses(&$vars) {
    $wrap = new Attribute();
    $wrap->addClass('site-wrap');
    if ($vars['is_front']) {
      $wrap->addClass('home-wrap');
    }
    $vars['wrap'] = $wrap;
  }

  public static function getThemeSuggestionsForBlocks(array &$suggestions, array $vars) {
    if (isset($vars['elements']['content']['#block_content'])) {
      $suggestions[] = 'block__custom__' . $vars['elements']['content']['#block_content']->bundle();
    }
    if (isset($vars['elements']['content']['#form_id'])) {
      $suggestions[] = 'block__' . $vars['elements']['content']['#form_id'];
    }
  }

  public static function getThemeSuggestionsForParagraphs(array &$suggestions, array $vars) {

  }

  public static function preprocessImageFormatter(&$vars) {
    /** @var ImageItem $image */
    $image = $vars['item'];
    // ImageItem -> FileFieldItemList -> EntityInterface
    $entity = $image->getParent()->getParent()->getValue();
    if ($entity instanceof Paragraph) {
      $parent = $entity->getParentEntity();
      if ($parent instanceof BlockContent && $parent->bundle() === 'slick') {
        $image_style = $parent->field_image_style->target_id;
        if ($image_style) {
          $vars['image'] = array_merge($vars['image'], [
            '#theme' => 'image_style',
            '#style_name' => $image_style,
          ]);
        }
      }
    }
  }

}
